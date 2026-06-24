import { FiBriefcase, FiFileText, FiShield, FiUsers } from 'react-icons/fi';
import { useProjectStore } from '../../stores/useProjectStore';
import { useAuthStore } from '../../stores/useAuthStore';
import MessageBubble from './MessageBubble';
import StreamingMessage from './StreamingMessage';
import GeneratingStatus from './GeneratingStatus';
import ChatInput from './ChatInput';
import StylePickerMessage from '../style-picker/StylePickerMessage';
import styles from './ChatArea.module.css';

const INVOICE_PROMPT =
  'Build a full-stack web application named "Smart Invoice Management" with an Indonesian-language UI using React (Tailwind CSS), Node.js/Express, PostgreSQL, and JWT authentication (Submitter, Approver, Admin roles) to centralize and automate manual invoice approval workflows. The application must feature an end-to-end pipeline containing a Submit module (invoice form with auto-calculating line items and PDF/image upload), an automated Route mechanism (conditional routing based on threshold/department with alerts), a Decide panel (approve/reject capabilities with mandatory comments), and a Track dashboard (real-time status filtering and analytics like total values and average approval times). Ensure complete data consistency across the pipeline and pre-populate the system with 8-10 dummy invoice records for testing.';

const MATCH_HIRE_PROMPT =
  'Build a full-stack web application named "MatchHire" using React (Tailwind CSS), Node.js/Express, PostgreSQL, and JWT authentication (Candidate and Recruiter roles) to automatically match job seekers with openings using an advanced compatibility algorithm. The application must feature profile and job posting modules, a 0-100% matching engine with a detailed criteria breakdown (40% skills, 25% experience, 15% location, 10% salary, 10% education), a candidate dashboard for viewing sorted recommendations and tracking applications, and a recruiter dashboard for managing ranked applicants and updating hiring statuses. Ensure a fully functional end-to-end workflow pre-populated with at least 10 dummy candidates and 10 dummy jobs for immediate testing.';

const CONTRACT_FLOW_PROMPT =
  'Build me a full-stack web application called "ContractFlow", a Contract Lifecycle Management (CLM) platform similar to DocuSign CLM, Ironclad, or Icertis, with the goal of letting teams create, review, negotiate, and track contracts digitally instead of managing them through email and static documents. Use this tech stack: React (with Tailwind CSS) for the frontend, Node.js/Express for the backend API, PostgreSQL as the database, and JWT-based authentication with roles (Drafter, Reviewer/Legal, Counterparty, Admin). Core features that must be fully functional: (1) contract creation from reusable templates with editable clauses and dynamic fields (parties, dates, amounts, terms); (2) a redlining/negotiation workflow where reviewers and counterparties can comment, suggest edits, and track version history on the same draft; (3) a multi-step approval/routing flow that sends the contract to the right approvers based on contract type or value, with e-signature support to finalize the agreement; (4) a dashboard to track every contract\'s status (Draft -> In Review -> Negotiation -> Signed -> Expired/Renewal Due), with search and filters by counterparty, contract type, status, and expiration date, plus automated alerts for upcoming renewals or expirations. Include at least 8-10 dummy contracts across different statuses so the full lifecycle can be tested end-to-end, and make sure version history, approval routing, and status tracking are backed by real logic, not just UI.';

const templates = [
  {
    id: 't1',
    icon: FiFileText,
    title: 'Procurement / GA',
    text: 'Smart Invoice Management',
    prompt: INVOICE_PROMPT,
  },
  {
    id: 't2',
    icon: FiUsers,
    title: 'HR',
    text: 'Job-Person Matching',
    prompt: MATCH_HIRE_PROMPT,
  },
  {
    id: 't3',
    icon: FiShield,
    title: 'Legal',
    text: 'Contract Lifecycle Management',
    prompt: CONTRACT_FLOW_PROMPT,
  },
  {
    id: 't4',
    icon: FiBriefcase,
    title: 'Operations',
    text: 'Service Request Desk',
    prompt:
      'Build a service request desk with intake, SLA timers, assignment routing, approval checkpoints, status tracking, and weekly analytics for throughput and completion time.',
  },
];

export default function ChatArea() {
  const {
    messages,
    activeProjectId,
    isStreaming,
    streamingText,
    isGenerating,
    isStylePickerOpen,
    setDraftPrompt,
  } = useProjectStore();
  const { user } = useAuthStore();

  const list = messages[activeProjectId] ?? [];
  const hasConversation = list.some((message) => message.role === 'user');

  return (
    <div className={styles.area}>
      {isStylePickerOpen ? <StylePickerMessage /> : null}

      {!hasConversation ? (
        <div className={styles.heroBlock}>
          <h1>Welcome to BSI CoBuilder Agent</h1>
          <p>Hi {user?.name || 'Admin'}, describe the internal app you want to build.</p>

          <div className={styles.heroComposer}>
            <ChatInput embedded />
          </div>

          <div className={styles.templateTitle}>START FROM A TEMPLATE</div>
          <div className={styles.templates}>
            {templates.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} type="button" className={styles.templateCard} onClick={() => setDraftPrompt(item.prompt)}>
                  <div className={styles.templateIcon}>
                    <Icon />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.thread}>
          {list.map((message) => {
            if (message.type === 'generating') return <GeneratingStatus key={message.id} />;
            return <MessageBubble key={message.id} message={message} />;
          })}
          {isGenerating ? <GeneratingStatus /> : null}
          {isStreaming && streamingText ? <StreamingMessage text={streamingText} /> : null}
        </div>
      )}
    </div>
  );
}