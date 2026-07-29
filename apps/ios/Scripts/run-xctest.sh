#!/bin/bash

set -u
set -o pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ios_dir="$(cd "${script_dir}/.." && pwd)"

destination="${COOKLOG_XCTEST_DESTINATION:-platform=iOS Simulator,name=iPhone 15,OS=17.2}"
timeout_seconds="${COOKLOG_XCTEST_TIMEOUT_SECONDS:-600}"
artifact_root="${COOKLOG_XCTEST_ARTIFACT_ROOT:-${TMPDIR:-/tmp}/CookLog-XCTest}"
run_id="$(date '+%Y%m%d-%H%M%S')-$$"
artifact_dir="${artifact_root}/${run_id}"
derived_data_path="${artifact_dir}/DerivedData"
result_bundle_path="${artifact_dir}/CookLogTests.xcresult"
log_path="${artifact_dir}/xcodebuild.log"
timeout_marker="${artifact_dir}/TIMED_OUT"

if ! [[ "${timeout_seconds}" =~ ^[1-9][0-9]*$ ]]; then
    echo "COOKLOG_XCTEST_TIMEOUT_SECONDS must be a positive integer." >&2
    exit 2
fi

mkdir -p "${artifact_dir}"

echo "XCTest destination: ${destination}"
echo "XCTest timeout: ${timeout_seconds}s"
echo "XCTest artifacts: ${artifact_dir}"

set +e
xcodebuild \
    -project "${ios_dir}/CookLog.xcodeproj" \
    -scheme CookLog \
    -destination "${destination}" \
    -destination-timeout 60 \
    -derivedDataPath "${derived_data_path}" \
    -resultBundlePath "${result_bundle_path}" \
    -parallel-testing-enabled NO \
    -maximum-parallel-testing-workers 1 \
    test > "${log_path}" 2>&1 &
xcodebuild_pid=$!

(
    elapsed=0
    while kill -0 "${xcodebuild_pid}" 2>/dev/null && (( elapsed < timeout_seconds )); do
        sleep 1
        (( elapsed += 1 ))
    done

    if kill -0 "${xcodebuild_pid}" 2>/dev/null; then
        touch "${timeout_marker}"
        kill -TERM "${xcodebuild_pid}" 2>/dev/null
        sleep 10
        kill -KILL "${xcodebuild_pid}" 2>/dev/null
    fi
) &
watchdog_pid=$!

wait "${xcodebuild_pid}"
status=$?
kill "${watchdog_pid}" 2>/dev/null
wait "${watchdog_pid}" 2>/dev/null
set -e

if [[ -f "${timeout_marker}" ]]; then
    echo "XCTest timed out after ${timeout_seconds}s." >&2
    echo "Log: ${log_path}" >&2
    [[ -d "${result_bundle_path}" ]] && echo "Partial xcresult: ${result_bundle_path}" >&2
    tail -n 80 "${log_path}" >&2
    exit 124
fi

echo "XCTest exit code: ${status}"
echo "Log: ${log_path}"
[[ -d "${result_bundle_path}" ]] && echo "xcresult: ${result_bundle_path}"
if (( status != 0 )); then
    tail -n 80 "${log_path}" >&2
fi
exit "${status}"
