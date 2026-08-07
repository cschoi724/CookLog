import Foundation
import SwiftUI

enum AppRoute: Hashable {
    case recipeLibrary
    case cookingLog(recordID: UUID, stepPreviews: [StepPreview])
    case aiReview(recordID: UUID, stepPreviews: [StepPreview])
    case recipeDetail(UUID)
    case recipeEditor(UUID)
    case audioPlayer(UUID)
    case appInfo

    init(_ destination: HomeRecordDestination) {
        switch destination {
        case .cookingLog(let recordID, let stepPreviews):
            self = .cookingLog(recordID: recordID, stepPreviews: stepPreviews)
        case .aiReview(let recordID, let stepPreviews):
            self = .aiReview(recordID: recordID, stepPreviews: stepPreviews)
        case .recipeDetail(let recordID):
            self = .recipeDetail(recordID)
        }
    }
}

enum AppInfoLegalDocument: Hashable {
    case privacy
    case terms

    var title: String {
        switch self {
        case .privacy: return "개인정보처리방침"
        case .terms: return "이용약관"
        }
    }
}

enum AppInfoState: Hashable {
    case overview
    case dataRetention
    case contactConsent
    case contactReady(includeDiagnostics: Bool)
    case mailUnavailable
    case legalLoading(AppInfoLegalDocument)
    case legalUnconfigured(AppInfoLegalDocument)
    case legalOpenError(AppInfoLegalDocument)
}

struct AppInfoConfiguration: Equatable {
    var supportEmail: String?
    var privacyURL: URL?
    var termsURL: URL?
    var appVersion: String

    static let releasePlaceholder = AppInfoConfiguration(
        supportEmail: nil,
        privacyURL: nil,
        termsURL: nil,
        appVersion: "1.0.0"
    )

    func url(for document: AppInfoLegalDocument) -> URL? {
        switch document {
        case .privacy: return privacyURL
        case .terms: return termsURL
        }
    }
}

struct SupportMailDraft: Equatable {
    let recipient: String
    let subject: String
    let body: String

    init(
        recipient: String,
        appVersion: String,
        includeDiagnostics: Bool,
        operatingSystemVersion: String = ProcessInfo.processInfo.operatingSystemVersionString
    ) {
        self.recipient = recipient
        subject = "CookLog 문의"

        var lines = [
            "문의 내용을 직접 작성해주세요.",
            "",
            "앱 버전: CookLog \(appVersion)"
        ]
        if includeDiagnostics {
            lines += [
                "OS 버전: \(operatingSystemVersion)",
                "오류 발생 화면·시각: 사용자가 직접 작성",
                "비콘텐츠 진단 범주: 사용자 선택으로 포함"
            ]
        }
        lines += [
            "",
            "음성, STT 본문, 레시피 내용과 검색어는 자동 첨부되지 않았습니다."
        ]
        body = lines.joined(separator: "\n")
    }

    var mailtoURL: URL? {
        var components = URLComponents()
        components.scheme = "mailto"
        components.path = recipient
        components.queryItems = [
            URLQueryItem(name: "subject", value: subject),
            URLQueryItem(name: "body", value: body)
        ]
        return components.url
    }
}

struct AppInfoView: View {
    @Environment(\.openURL) private var openURL
    @State private var state: AppInfoState = .overview
    @State private var includeDiagnostics = false
    let configuration: AppInfoConfiguration

    init(configuration: AppInfoConfiguration = .releasePlaceholder) {
        self.configuration = configuration
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                content
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 24)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .background(HomeTheme.backgroundBase)
        .navigationTitle("앱 정보")
        .navigationBarTitleDisplayMode(.inline)
    }

    @ViewBuilder
    private var content: some View {
        switch state {
        case .overview:
            overview
        case .dataRetention:
            dataRetention
        case .contactConsent:
            contactConsent
        case .contactReady(let includeDiagnostics):
            contactReady(includeDiagnostics: includeDiagnostics)
        case .mailUnavailable:
            failure(
                title: "이메일 앱을 열 수 없어요",
                message: "문의 내용과 진단 정보는 전송되지 않았고 CookLog 기록에는 영향을 주지 않았습니다.",
                retryTitle: "다시 준비",
                retry: { state = .contactConsent }
            )
        case .legalLoading(let document):
            legalLoading(document)
        case .legalUnconfigured(let document):
            failure(
                title: "\(document.title) 링크가 아직 연결되지 않았어요",
                message: "임시 문안을 공개 문서처럼 표시하지 않습니다. 출시 통합 전에 운영 URL을 연결해야 합니다.",
                retryTitle: "앱 정보로 돌아가기",
                retry: { state = .overview }
            )
        case .legalOpenError(let document):
            failure(
                title: "\(document.title)을 열지 못했어요",
                message: "선택한 문서만 다시 시도합니다. 저장된 요리 기록과 다른 로컬 기능은 계속 사용할 수 있어요.",
                retryTitle: "링크 다시 열기",
                retry: { open(document) }
            )
        }
    }

    private var overview: some View {
        VStack(alignment: .leading, spacing: 20) {
            VStack(alignment: .leading, spacing: 8) {
                Text("COOKLOG")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(HomeTheme.accent)
                Text("나의 요리 기록")
                    .font(.largeTitle.bold())
                    .accessibilityAddTraits(.isHeader)
                Text("버전 \(configuration.appVersion) · 첫 공개 출시")
                    .foregroundStyle(.secondary)
            }

            VStack(spacing: 10) {
                infoButton("이메일 문의하기", detail: "콘텐츠 자동 첨부 없이 문의", icon: "envelope") {
                    state = .contactConsent
                }
                infoButton("개인정보처리방침", detail: "공개 URL 연결 상태 포함", icon: "hand.raised") {
                    open(.privacy)
                }
                infoButton("이용약관", detail: "공개 URL 연결 상태 포함", icon: "doc.text") {
                    open(.terms)
                }
                infoButton("데이터 보관 안내", detail: "로컬 저장과 복구 한계", icon: "internaldrive") {
                    state = .dataRetention
                }
            }

            AppInfoNotice(
                title: "기록은 현재 기기에 저장돼요",
                message: "CookLog 자체 백업·복구·기기 간 동기화는 첫 출시에서 제공하지 않습니다."
            )

            Text("실제 문의 주소와 법적 문서 URL은 출시 통합 전에 연결·검증해야 합니다.")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
    }

    private var dataRetention: some View {
        VStack(alignment: .leading, spacing: 18) {
            infoHeading("LOCAL DATA", "내 요리 기록은 이 기기에 보관돼요", "진행 기록, STEP Preview와 완성 레시피는 현재 기기의 앱 저장소에 보관됩니다.")
            AppInfoNotice(title: "CookLog 로컬 저장", message: "앱 삭제, 기기 초기화·분실 또는 저장소 손상 시 기록이 유실될 수 있습니다.")
            Text("제공하지 않는 기능")
                .font(.headline)
            Text("CookLog 자체 서버 백업, 복구, 기기 간 동기화와 레시피 내보내기는 첫 출시에서 제공하지 않습니다. 운영체제 백업도 CookLog가 복구를 보장하지 않습니다.")
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
            backButton
        }
    }

    private var contactConsent: some View {
        VStack(alignment: .leading, spacing: 18) {
            infoHeading("EMAIL SUPPORT", "어떤 정보와 함께 문의할까요?", "문의 내용은 사용자가 메일에서 직접 작성합니다.")
            AppInfoNotice(title: "사용자 콘텐츠는 첨부하지 않아요", message: "음성, STT 본문, 레시피 내용과 검색어를 자동으로 포함하지 않습니다.")
            AppInfoNotice(title: "앱 버전만 기본 제공", message: "CookLog \(configuration.appVersion)만 기본 제공하며, 아래 비콘텐츠 진단 정보는 직접 선택해야 포함됩니다.")
            Toggle(isOn: $includeDiagnostics) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("비콘텐츠 진단 정보 포함")
                        .font(.headline)
                    Text("OS 버전 · 오류 발생 화면과 시각 · 진단 범주")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .frame(minHeight: 44)
            Button("문의 준비") {
                state = .contactReady(includeDiagnostics: includeDiagnostics)
            }
            .buttonStyle(.borderedProminent)
            .tint(HomeTheme.accent)
            .frame(minHeight: 44)
        }
    }

    private func contactReady(includeDiagnostics: Bool) -> some View {
        VStack(alignment: .leading, spacing: 18) {
            infoHeading("CONTACT READY", "문의 준비가 끝났어요", "메일 앱에서 문의 내용을 직접 작성하고 전송 여부를 확인해주세요.")
            AppInfoNotice(
                title: "포함될 기본 정보",
                message: includeDiagnostics
                    ? "CookLog \(configuration.appVersion), OS 버전, 오류 발생 화면·시각과 비콘텐츠 진단 범주"
                    : "CookLog \(configuration.appVersion)만 포함됩니다. 사용자 콘텐츠는 포함되지 않습니다."
            )
            Button("이메일 앱 열기") { openSupportEmail(includeDiagnostics: includeDiagnostics) }
                .buttonStyle(.borderedProminent)
                .tint(HomeTheme.accent)
                .frame(minHeight: 44)
            backButton
        }
    }

    private func legalLoading(_ document: AppInfoLegalDocument) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            ProgressView()
            Text("\(document.title)을 확인하는 중")
                .font(.title2.bold())
                .accessibilityAddTraits(.isHeader)
            Text("선택한 공개 문서 링크만 확인합니다.")
                .foregroundStyle(.secondary)
        }
        .task(id: document) {
            guard configuration.url(for: document) != nil else {
                state = .legalUnconfigured(document)
                return
            }
        }
    }

    private func failure(title: String, message: String, retryTitle: String, retry: @escaping () -> Void) -> some View {
        VStack(alignment: .leading, spacing: 18) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.largeTitle)
                .foregroundStyle(HomeTheme.error)
            Text(title)
                .font(.title2.bold())
                .accessibilityAddTraits(.isHeader)
            Text(message)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
            Button(retryTitle, action: retry)
                .buttonStyle(.borderedProminent)
                .tint(HomeTheme.accent)
                .frame(minHeight: 44)
            backButton
        }
    }

    private func infoHeading(_ eyebrow: String, _ title: String, _ message: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(eyebrow)
                .font(.caption.weight(.semibold))
                .foregroundStyle(HomeTheme.accent)
            Text(title)
                .font(.title2.bold())
                .accessibilityAddTraits(.isHeader)
            Text(message)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private func infoButton(_ title: String, detail: String, icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack(spacing: 14) {
                Image(systemName: icon)
                    .frame(width: 28)
                    .foregroundStyle(HomeTheme.accent)
                VStack(alignment: .leading, spacing: 3) {
                    Text(title).font(.headline)
                    Text(detail).font(.caption).foregroundStyle(.secondary)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .foregroundStyle(.tertiary)
            }
            .contentShape(Rectangle())
            .frame(minHeight: 54)
        }
        .buttonStyle(.plain)
        .accessibilityElement(children: .combine)
        .accessibilityHint("새 화면으로 이동합니다.")
    }

    private var backButton: some View {
        Button("앱 정보로 돌아가기") { state = .overview }
            .buttonStyle(.bordered)
            .frame(minHeight: 44)
    }

    private func open(_ document: AppInfoLegalDocument) {
        state = .legalLoading(document)
        guard let url = configuration.url(for: document) else { return }
        openURL(url) { accepted in
            if !accepted { state = .legalOpenError(document) }
        }
    }

    private func openSupportEmail(includeDiagnostics: Bool) {
        guard let supportEmail = configuration.supportEmail,
              let url = SupportMailDraft(
                recipient: supportEmail,
                appVersion: configuration.appVersion,
                includeDiagnostics: includeDiagnostics
              ).mailtoURL else {
            state = .mailUnavailable
            return
        }
        openURL(url) { accepted in
            if !accepted { state = .mailUnavailable }
        }
    }
}

private struct AppInfoNotice: View {
    let title: String
    let message: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: "info.circle.fill")
                .foregroundStyle(HomeTheme.accent)
            VStack(alignment: .leading, spacing: 5) {
                Text(title).font(.headline)
                Text(message)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(HomeTheme.backgroundElevated, in: RoundedRectangle(cornerRadius: 16))
    }
}
