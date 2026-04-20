/**
 * SEED DATA — TaskFlow Demo Database
 *
 * Membership overview (who can see which boards):
 *  Sara   (user_1) — owns board_1 | invited to board_2, board_4
 *  Hazem  (user_2) — owns board_2 | invited to board_1, board_4
 *  Nour   (user_3) — owns board_3 | invited to board_2, board_5
 *  Khaled (user_4) — owns board_4 | invited to board_1
 *  Lina   (user_5) — owns board_5 | invited to board_3
 *
 * Demo credentials:
 *  sara@taskflow.io   / sara123
 *  hazem@taskflow.io  / hazem123
 *  nour@taskflow.io   / nour123
 *  khaled@taskflow.io / khaled123
 *  lina@taskflow.io   / lina123
 */
export const SEED_DATA = {

  /* ═══════════════════════════════════════════════════════════════════════
     USERS
  ════════════════════════════════════════════════════════════════════════ */
  users: [
    {
      id: 'user_1',
      name: 'Sara Ahmed',
      email: 'sara@taskflow.io',
      password: 'sara123',
      role: 'member',
      avatar: 'https://i.pravatar.cc/150?img=5',
      createdAt: '2025-11-01T00:00:00.000Z'
    },
    {
      id: 'user_2',
      name: 'Hazem Ahmed',
      email: 'hazem@taskflow.io',
      password: 'hazem123',
      role: 'member',
      avatar: 'https://i.pravatar.cc/150?img=12',
      createdAt: '2025-11-05T00:00:00.000Z'
    },
    {
      id: 'user_3',
      name: 'Nour El-Din',
      email: 'nour@taskflow.io',
      password: 'nour123',
      role: 'member',
      avatar: 'https://i.pravatar.cc/150?img=9',
      createdAt: '2025-11-10T00:00:00.000Z'
    },
    {
      id: 'user_4',
      name: 'Khaled Mostafa',
      email: 'khaled@taskflow.io',
      password: 'khaled123',
      role: 'member',
      avatar: 'https://i.pravatar.cc/150?img=11',
      createdAt: '2025-11-15T00:00:00.000Z'
    },
    {
      id: 'user_5',
      name: 'Lina Mahmoud',
      email: 'lina@taskflow.io',
      password: 'lina123',
      role: 'member',
      avatar: 'https://i.pravatar.cc/150?img=25',
      createdAt: '2025-11-20T00:00:00.000Z'
    }
  ],

  /* ═══════════════════════════════════════════════════════════════════════
     BOARDS
  ════════════════════════════════════════════════════════════════════════ */
  boards: [

    /* ─── board_1 : E-Commerce Redesign ────────────────────────────────
       Owner: Sara (user_1)   |  Members: Sara, Omar, Khaled
    ──────────────────────────────────────────────────────────────────── */
    {
      id: 'board_1',
      title: 'E-Commerce Redesign',
      description: 'Full redesign of the online store — UX, checkout flow, and performance',
      ownerId: 'user_1',
      members: ['user_1', 'user_2', 'user_4'],
      backgroundColor: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      isStarred: true,
      createdAt: '2026-01-05T09:00:00.000Z',
      updatedAt: '2026-04-10T12:00:00.000Z',
      lists: [
        {
          id: 'list_1_1',
          title: 'Backlog',
          boardId: 'board_1',
          position: 0,
          createdAt: '2026-01-05T09:00:00.000Z',
          updatedAt: '2026-01-05T09:00:00.000Z',
          cards: [
            {
              id: 'card_1_1_1',
              title: 'Accessibility audit on current site',
              description: 'Run axe / WCAG 2.1 AA checks on all major pages. Log issues in GitHub.',
              listId: 'list_1_1',
              boardId: 'board_1',
              assignedUsers: ['user_2'],
              priority: 'medium',
              deadline: '2026-05-10T00:00:00.000Z',
              createdAt: '2026-01-06T00:00:00.000Z',
              updatedAt: '2026-01-06T00:00:00.000Z',
              position: 0,
              labels: ['frontend', 'review'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_1_1_2',
              title: 'Define new color palette & typography',
              description: 'Work with designer to establish brand tokens. Export to Figma.',
              listId: 'list_1_1',
              boardId: 'board_1',
              assignedUsers: ['user_1'],
              priority: 'low',
              deadline: null,
              createdAt: '2026-01-07T00:00:00.000Z',
              updatedAt: '2026-01-07T00:00:00.000Z',
              position: 1,
              labels: ['design', 'branding'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_1_1_3',
              title: 'Research competitor checkout flows',
              description: 'Analyse Amazon, Noon, Shein — identify friction points.',
              listId: 'list_1_1',
              boardId: 'board_1',
              assignedUsers: ['user_4'],
              priority: 'low',
              deadline: null,
              createdAt: '2026-01-08T00:00:00.000Z',
              updatedAt: '2026-01-08T00:00:00.000Z',
              position: 2,
              labels: ['planning'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_1_2',
          title: 'In Progress',
          boardId: 'board_1',
          position: 1,
          createdAt: '2026-01-05T09:00:00.000Z',
          updatedAt: '2026-01-05T09:00:00.000Z',
          cards: [
            {
              id: 'card_1_2_1',
              title: 'Redesign product listing page',
              description: 'New grid layout, filter sidebar, lazy-loading images. Mobile-first.',
              listId: 'list_1_2',
              boardId: 'board_1',
              assignedUsers: ['user_1', 'user_2'],
              priority: 'high',
              deadline: '2026-04-30T00:00:00.000Z',
              createdAt: '2026-02-01T00:00:00.000Z',
              updatedAt: '2026-04-01T00:00:00.000Z',
              position: 0,
              labels: ['frontend', 'design'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_1_2_2',
              title: 'Stripe payment integration',
              description: 'Replace old payment gateway with Stripe. Implement 3DS2, webhooks.',
              listId: 'list_1_2',
              boardId: 'board_1',
              assignedUsers: ['user_4'],
              priority: 'urgent',
              deadline: '2026-04-25T00:00:00.000Z',
              createdAt: '2026-02-05T00:00:00.000Z',
              updatedAt: '2026-04-05T00:00:00.000Z',
              position: 1,
              labels: ['backend', 'api'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_1_3',
          title: 'Review',
          boardId: 'board_1',
          position: 2,
          createdAt: '2026-01-05T09:00:00.000Z',
          updatedAt: '2026-01-05T09:00:00.000Z',
          cards: [
            {
              id: 'card_1_3_1',
              title: 'New homepage hero section',
              description: 'Animated hero with video background, CTA buttons. Awaiting client sign-off.',
              listId: 'list_1_3',
              boardId: 'board_1',
              assignedUsers: ['user_1'],
              priority: 'high',
              deadline: '2026-04-20T00:00:00.000Z',
              createdAt: '2026-03-01T00:00:00.000Z',
              updatedAt: '2026-04-10T00:00:00.000Z',
              position: 0,
              labels: ['design', 'frontend'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_1_4',
          title: 'Done',
          boardId: 'board_1',
          position: 3,
          createdAt: '2026-01-05T09:00:00.000Z',
          updatedAt: '2026-01-05T09:00:00.000Z',
          cards: [
            {
              id: 'card_1_4_1',
              title: 'Set up monorepo with Nx',
              description: 'Shared libs for UI kit, utils, API client. Turbo caching configured.',
              listId: 'list_1_4',
              boardId: 'board_1',
              assignedUsers: ['user_4'],
              priority: 'high',
              deadline: null,
              createdAt: '2026-01-10T00:00:00.000Z',
              updatedAt: '2026-02-01T00:00:00.000Z',
              position: 0,
              labels: ['setup', 'devops'],
              comments: [],
              attachments: [],
              isCompleted: true,
              completionNote: 'Monorepo live, all packages building. CI cache hit rate 85%.'
            },
            {
              id: 'card_1_4_2',
              title: 'Write ADR for state management choice',
              description: 'Decided on NgRx Signal Store. ADR committed.',
              listId: 'list_1_4',
              boardId: 'board_1',
              assignedUsers: ['user_2'],
              priority: 'medium',
              deadline: null,
              createdAt: '2026-01-15T00:00:00.000Z',
              updatedAt: '2026-02-05T00:00:00.000Z',
              position: 1,
              labels: ['documentation'],
              comments: [],
              attachments: [],
              isCompleted: true,
              completionNote: 'ADR-001 merged and shared with the team.'
            }
          ]
        }
      ]
    },

    /* ─── board_2 : Mobile App MVP ─────────────────────────────────────
       Owner: Omar (user_2)  |  Members: Omar, Sara, Nour
    ──────────────────────────────────────────────────────────────────── */
    {
      id: 'board_2',
      title: 'Mobile App MVP',
      description: 'Cross-platform React Native app — first public release by end of Q2',
      ownerId: 'user_2',
      members: ['user_2', 'user_1', 'user_3'],
      backgroundColor: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
      isStarred: false,
      createdAt: '2026-01-20T09:00:00.000Z',
      updatedAt: '2026-04-12T08:00:00.000Z',
      lists: [
        {
          id: 'list_2_1',
          title: 'To Do',
          boardId: 'board_2',
          position: 0,
          createdAt: '2026-01-20T09:00:00.000Z',
          updatedAt: '2026-01-20T09:00:00.000Z',
          cards: [
            {
              id: 'card_2_1_1',
              title: 'Push notification infrastructure',
              description: 'Firebase Cloud Messaging for Android + APNS for iOS. Handle deep links.',
              listId: 'list_2_1',
              boardId: 'board_2',
              assignedUsers: ['user_2'],
              priority: 'high',
              deadline: '2026-05-15T00:00:00.000Z',
              createdAt: '2026-01-21T00:00:00.000Z',
              updatedAt: '2026-01-21T00:00:00.000Z',
              position: 0,
              labels: ['backend', 'api'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_2_1_2',
              title: 'Offline mode with SQLite',
              description: 'Cache critical user data locally. Sync on reconnect with conflict resolution.',
              listId: 'list_2_1',
              boardId: 'board_2',
              assignedUsers: ['user_3'],
              priority: 'medium',
              deadline: '2026-05-30T00:00:00.000Z',
              createdAt: '2026-01-22T00:00:00.000Z',
              updatedAt: '2026-01-22T00:00:00.000Z',
              position: 1,
              labels: ['backend'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_2_1_3',
              title: 'App Store & Play Store listing assets',
              description: 'Screenshots, preview video, keyword research, localisation (EN + AR).',
              listId: 'list_2_1',
              boardId: 'board_2',
              assignedUsers: ['user_1'],
              priority: 'low',
              deadline: null,
              createdAt: '2026-01-23T00:00:00.000Z',
              updatedAt: '2026-01-23T00:00:00.000Z',
              position: 2,
              labels: ['design', 'content'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_2_2',
          title: 'In Development',
          boardId: 'board_2',
          position: 1,
          createdAt: '2026-01-20T09:00:00.000Z',
          updatedAt: '2026-01-20T09:00:00.000Z',
          cards: [
            {
              id: 'card_2_2_1',
              title: 'User profile & settings screen',
              description: 'Edit name, avatar, password, notification preferences, dark mode toggle.',
              listId: 'list_2_2',
              boardId: 'board_2',
              assignedUsers: ['user_1'],
              priority: 'medium',
              deadline: '2026-04-28T00:00:00.000Z',
              createdAt: '2026-02-10T00:00:00.000Z',
              updatedAt: '2026-04-08T00:00:00.000Z',
              position: 0,
              labels: ['frontend', 'ui'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_2_2_2',
              title: 'Home feed with infinite scroll',
              description: 'Virtualised FlatList, skeleton loaders, pull-to-refresh.',
              listId: 'list_2_2',
              boardId: 'board_2',
              assignedUsers: ['user_2', 'user_3'],
              priority: 'high',
              deadline: '2026-04-26T00:00:00.000Z',
              createdAt: '2026-02-12T00:00:00.000Z',
              updatedAt: '2026-04-09T00:00:00.000Z',
              position: 1,
              labels: ['frontend'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_2_3',
          title: 'QA / Testing',
          boardId: 'board_2',
          position: 2,
          createdAt: '2026-01-20T09:00:00.000Z',
          updatedAt: '2026-01-20T09:00:00.000Z',
          cards: [
            {
              id: 'card_2_3_1',
              title: 'E2E tests for login & onboarding',
              description: 'Detox test suite covering OTP login, onboarding walkthrough, permission prompts.',
              listId: 'list_2_3',
              boardId: 'board_2',
              assignedUsers: ['user_3'],
              priority: 'high',
              deadline: '2026-04-22T00:00:00.000Z',
              createdAt: '2026-03-15T00:00:00.000Z',
              updatedAt: '2026-04-10T00:00:00.000Z',
              position: 0,
              labels: ['review'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_2_4',
          title: 'Shipped',
          boardId: 'board_2',
          position: 3,
          createdAt: '2026-01-20T09:00:00.000Z',
          updatedAt: '2026-01-20T09:00:00.000Z',
          cards: [
            {
              id: 'card_2_4_1',
              title: 'Bootstrap project with Expo SDK 51',
              description: 'EAS Build, TypeScript strict mode, Prettier, ESLint, Husky hooks.',
              listId: 'list_2_4',
              boardId: 'board_2',
              assignedUsers: ['user_2'],
              priority: 'high',
              deadline: null,
              createdAt: '2026-01-20T00:00:00.000Z',
              updatedAt: '2026-01-25T00:00:00.000Z',
              position: 0,
              labels: ['setup'],
              comments: [],
              attachments: [],
              isCompleted: true,
              completionNote: 'Project scaffolded and pipelines verified on iOS + Android emulators.'
            },
            {
              id: 'card_2_4_2',
              title: 'OTP-based authentication',
              description: 'Phone number login via Twilio Verify. Session stored in SecureStore.',
              listId: 'list_2_4',
              boardId: 'board_2',
              assignedUsers: ['user_2', 'user_1'],
              priority: 'urgent',
              deadline: null,
              createdAt: '2026-01-28T00:00:00.000Z',
              updatedAt: '2026-02-20T00:00:00.000Z',
              position: 1,
              labels: ['auth', 'backend'],
              comments: [],
              attachments: [],
              isCompleted: true,
              completionNote: 'OTP flow live in staging. Rate limiting and fraud checks passed security review.'
            }
          ]
        }
      ]
    },

    /* ─── board_3 : Marketing Q2 Campaign ─────────────────────────────
       Owner: Nour (user_3)  |  Members: Nour, Lina
    ──────────────────────────────────────────────────────────────────── */
    {
      id: 'board_3',
      title: 'Marketing Q2 Campaign',
      description: 'Spring product launch across social, email, and paid channels',
      ownerId: 'user_3',
      members: ['user_3', 'user_5'],
      backgroundColor: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      isStarred: false,
      createdAt: '2026-02-01T09:00:00.000Z',
      updatedAt: '2026-04-14T10:00:00.000Z',
      lists: [
        {
          id: 'list_3_1',
          title: 'Ideas',
          boardId: 'board_3',
          position: 0,
          createdAt: '2026-02-01T09:00:00.000Z',
          updatedAt: '2026-02-01T09:00:00.000Z',
          cards: [
            {
              id: 'card_3_1_1',
              title: 'Influencer partnership micro-campaign',
              description: '3–5 nano-influencers in F&B niche. Gifting model, UGC rights in contract.',
              listId: 'list_3_1',
              boardId: 'board_3',
              assignedUsers: ['user_5'],
              priority: 'medium',
              deadline: null,
              createdAt: '2026-02-02T00:00:00.000Z',
              updatedAt: '2026-02-02T00:00:00.000Z',
              position: 0,
              labels: ['social', 'outreach'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_3_1_2',
              title: 'Referral programme mechanics',
              description: 'Double-sided reward (giver + receiver). Legal review needed.',
              listId: 'list_3_1',
              boardId: 'board_3',
              assignedUsers: ['user_3'],
              priority: 'low',
              deadline: null,
              createdAt: '2026-02-03T00:00:00.000Z',
              updatedAt: '2026-02-03T00:00:00.000Z',
              position: 1,
              labels: ['planning'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_3_2',
          title: 'In Progress',
          boardId: 'board_3',
          position: 1,
          createdAt: '2026-02-01T09:00:00.000Z',
          updatedAt: '2026-02-01T09:00:00.000Z',
          cards: [
            {
              id: 'card_3_2_1',
              title: 'Q2 content calendar (April – June)',
              description: '90-day editorial plan. 3 posts/week Instagram, 5 tweets/week, weekly email newsletter.',
              listId: 'list_3_2',
              boardId: 'board_3',
              assignedUsers: ['user_3', 'user_5'],
              priority: 'high',
              deadline: '2026-04-20T00:00:00.000Z',
              createdAt: '2026-02-10T00:00:00.000Z',
              updatedAt: '2026-04-01T00:00:00.000Z',
              position: 0,
              labels: ['content', 'planning'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_3_2_2',
              title: 'Paid ads budget allocation',
              description: 'Google Ads vs Meta. A/B test creatives. Assign 60/40 split initially.',
              listId: 'list_3_2',
              boardId: 'board_3',
              assignedUsers: ['user_3'],
              priority: 'urgent',
              deadline: '2026-04-21T00:00:00.000Z',
              createdAt: '2026-02-15T00:00:00.000Z',
              updatedAt: '2026-04-05T00:00:00.000Z',
              position: 1,
              labels: ['planning'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_3_3',
          title: 'Done',
          boardId: 'board_3',
          position: 2,
          createdAt: '2026-02-01T09:00:00.000Z',
          updatedAt: '2026-02-01T09:00:00.000Z',
          cards: [
            {
              id: 'card_3_3_1',
              title: 'Competitor benchmarking report',
              description: 'Analysed 8 direct competitors. Share-of-voice, pricing, tone-of-voice.',
              listId: 'list_3_3',
              boardId: 'board_3',
              assignedUsers: ['user_5'],
              priority: 'medium',
              deadline: null,
              createdAt: '2026-02-05T00:00:00.000Z',
              updatedAt: '2026-03-01T00:00:00.000Z',
              position: 0,
              labels: ['planning', 'review'],
              comments: [],
              attachments: [],
              isCompleted: true,
              completionNote: 'Report distributed to the full marketing team. Key insights shared in weekly meeting.'
            }
          ]
        }
      ]
    },

    /* ─── board_4 : DevOps & Infrastructure ────────────────────────────
       Owner: Khaled (user_4)  |  Members: Khaled, Sara, Omar
    ──────────────────────────────────────────────────────────────────── */
    {
      id: 'board_4',
      title: 'DevOps & Infrastructure',
      description: 'CI/CD pipelines, Kubernetes migration, monitoring and zero-downtime deploys',
      ownerId: 'user_4',
      members: ['user_4', 'user_1', 'user_2'],
      backgroundColor: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
      isStarred: true,
      createdAt: '2026-01-10T09:00:00.000Z',
      updatedAt: '2026-04-13T14:00:00.000Z',
      lists: [
        {
          id: 'list_4_1',
          title: 'Pending',
          boardId: 'board_4',
          position: 0,
          createdAt: '2026-01-10T09:00:00.000Z',
          updatedAt: '2026-01-10T09:00:00.000Z',
          cards: [
            {
              id: 'card_4_1_1',
              title: 'Kubernetes cluster cost optimisation',
              description: 'Right-size node pools. Spot instances for batch workloads. Target 30% saving.',
              listId: 'list_4_1',
              boardId: 'board_4',
              assignedUsers: ['user_4'],
              priority: 'medium',
              deadline: '2026-06-01T00:00:00.000Z',
              createdAt: '2026-01-12T00:00:00.000Z',
              updatedAt: '2026-01-12T00:00:00.000Z',
              position: 0,
              labels: ['devops'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_4_1_2',
              title: 'Disaster recovery runbook',
              description: 'Document RTO/RPO targets. Full DR drill every quarter.',
              listId: 'list_4_1',
              boardId: 'board_4',
              assignedUsers: ['user_2'],
              priority: 'high',
              deadline: '2026-05-20T00:00:00.000Z',
              createdAt: '2026-01-13T00:00:00.000Z',
              updatedAt: '2026-01-13T00:00:00.000Z',
              position: 1,
              labels: ['documentation', 'devops'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_4_2',
          title: 'In Progress',
          boardId: 'board_4',
          position: 1,
          createdAt: '2026-01-10T09:00:00.000Z',
          updatedAt: '2026-01-10T09:00:00.000Z',
          cards: [
            {
              id: 'card_4_2_1',
              title: 'GitHub Actions CI/CD pipeline',
              description: 'Build → Test → Lint → Docker push → Helm deploy. Matrix builds for Node 18 + 20.',
              listId: 'list_4_2',
              boardId: 'board_4',
              assignedUsers: ['user_4', 'user_1'],
              priority: 'urgent',
              deadline: '2026-04-24T00:00:00.000Z',
              createdAt: '2026-02-01T00:00:00.000Z',
              updatedAt: '2026-04-10T00:00:00.000Z',
              position: 0,
              labels: ['devops'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_4_2_2',
              title: 'Grafana + Prometheus observability stack',
              description: 'Dashboards for API latency, error rate, pod health. PagerDuty alerts configured.',
              listId: 'list_4_2',
              boardId: 'board_4',
              assignedUsers: ['user_2'],
              priority: 'high',
              deadline: '2026-04-28T00:00:00.000Z',
              createdAt: '2026-02-05T00:00:00.000Z',
              updatedAt: '2026-04-08T00:00:00.000Z',
              position: 1,
              labels: ['devops'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_4_3',
          title: 'Done',
          boardId: 'board_4',
          position: 2,
          createdAt: '2026-01-10T09:00:00.000Z',
          updatedAt: '2026-01-10T09:00:00.000Z',
          cards: [
            {
              id: 'card_4_3_1',
              title: 'Dockerise all microservices',
              description: 'Multi-stage builds. Distroless base images. Non-root users.',
              listId: 'list_4_3',
              boardId: 'board_4',
              assignedUsers: ['user_4'],
              priority: 'high',
              deadline: null,
              createdAt: '2026-01-15T00:00:00.000Z',
              updatedAt: '2026-02-10T00:00:00.000Z',
              position: 0,
              labels: ['devops'],
              comments: [],
              attachments: [],
              isCompleted: true,
              completionNote: '12 services containerised. Average image size reduced by 40% with multi-stage builds.'
            },
            {
              id: 'card_4_3_2',
              title: 'Set up development environment docs',
              description: 'One-command local setup with docker-compose. README with env vars table.',
              listId: 'list_4_3',
              boardId: 'board_4',
              assignedUsers: ['user_1'],
              priority: 'medium',
              deadline: null,
              createdAt: '2026-01-18T00:00:00.000Z',
              updatedAt: '2026-02-01T00:00:00.000Z',
              position: 1,
              labels: ['documentation'],
              comments: [],
              attachments: [],
              isCompleted: true,
              completionNote: 'Docs merged. New dev onboarding time cut from 2 days to 2 hours.'
            }
          ]
        }
      ]
    },

    /* ─── board_5 : HR Onboarding Portal ──────────────────────────────
       Owner: Lina (user_5)  |  Members: Lina, Nour
    ──────────────────────────────────────────────────────────────────── */
    {
      id: 'board_5',
      title: 'HR Onboarding Portal',
      description: 'Digital onboarding experience for new hires — docs, checklists, and welcome flows',
      ownerId: 'user_5',
      members: ['user_5', 'user_3'],
      backgroundColor: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
      isStarred: false,
      createdAt: '2026-02-15T09:00:00.000Z',
      updatedAt: '2026-04-11T09:00:00.000Z',
      lists: [
        {
          id: 'list_5_1',
          title: 'To Design',
          boardId: 'board_5',
          position: 0,
          createdAt: '2026-02-15T09:00:00.000Z',
          updatedAt: '2026-02-15T09:00:00.000Z',
          cards: [
            {
              id: 'card_5_1_1',
              title: 'Employee handbook (digital version)',
              description: 'Convert PDF handbook to interactive web version. Include search, bookmarks.',
              listId: 'list_5_1',
              boardId: 'board_5',
              assignedUsers: ['user_5'],
              priority: 'medium',
              deadline: '2026-05-30T00:00:00.000Z',
              createdAt: '2026-02-16T00:00:00.000Z',
              updatedAt: '2026-02-16T00:00:00.000Z',
              position: 0,
              labels: ['documentation', 'design'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_5_1_2',
              title: 'New hire 30-60-90 day plan template',
              description: 'Role-agnostic template with milestones and check-in prompts.',
              listId: 'list_5_1',
              boardId: 'board_5',
              assignedUsers: ['user_3'],
              priority: 'low',
              deadline: null,
              createdAt: '2026-02-17T00:00:00.000Z',
              updatedAt: '2026-02-17T00:00:00.000Z',
              position: 1,
              labels: ['planning'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_5_2',
          title: 'In Progress',
          boardId: 'board_5',
          position: 1,
          createdAt: '2026-02-15T09:00:00.000Z',
          updatedAt: '2026-02-15T09:00:00.000Z',
          cards: [
            {
              id: 'card_5_2_1',
              title: 'Welcome email sequence (5 emails)',
              description: 'Day 0: welcome. Day 1: tools access. Day 3: team intro. Day 7: check-in. Day 30: review.',
              listId: 'list_5_2',
              boardId: 'board_5',
              assignedUsers: ['user_5', 'user_3'],
              priority: 'high',
              deadline: '2026-04-25T00:00:00.000Z',
              createdAt: '2026-03-01T00:00:00.000Z',
              updatedAt: '2026-04-10T00:00:00.000Z',
              position: 0,
              labels: ['content'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_5_3',
          title: 'Done',
          boardId: 'board_5',
          position: 2,
          createdAt: '2026-02-15T09:00:00.000Z',
          updatedAt: '2026-02-15T09:00:00.000Z',
          cards: [
            {
              id: 'card_5_3_1',
              title: 'Org chart — interactive version',
              description: 'D3-based org chart with photos, roles, reporting lines. Integrates with HRIS.',
              listId: 'list_5_3',
              boardId: 'board_5',
              assignedUsers: ['user_3'],
              priority: 'medium',
              deadline: null,
              createdAt: '2026-02-20T00:00:00.000Z',
              updatedAt: '2026-03-15T00:00:00.000Z',
              position: 0,
              labels: ['design', 'frontend'],
              comments: [],
              attachments: [],
              isCompleted: true,
              completionNote: 'Live at /org-chart. Updated automatically from HRIS nightly sync.'
            }
          ]
        }
      ]
    }
  ],

  /* ═══════════════════════════════════════════════════════════════════════
     NOTIFICATIONS
     Each notification targets the user it belongs to.
  ════════════════════════════════════════════════════════════════════════ */
  notifications: [
    /* Sara is notified about being assigned to board_4 tasks */
    {
      id: 'notif_1',
      userId: 'user_1',
      type: 'card_assigned',
      message: "You've been assigned to \"CI/CD pipeline\" on DevOps & Infrastructure",
      relatedEntityId: 'card_4_2_1',
      isRead: false,
      createdAt: '2026-04-10T08:00:00.000Z'
    },
    /* Omar is notified about being assigned to a task on board_1 */
    {
      id: 'notif_2',
      userId: 'user_2',
      type: 'card_assigned',
      message: "You've been assigned to \"Redesign product listing page\" on E-Commerce Redesign",
      relatedEntityId: 'card_1_2_1',
      isRead: false,
      createdAt: '2026-04-11T09:30:00.000Z'
    },
    /* Khaled invited to board_1 */
    {
      id: 'notif_3',
      userId: 'user_4',
      type: 'board_invitation',
      message: 'Sara Ahmed invited you to join "E-Commerce Redesign"',
      relatedEntityId: 'board_1',
      isRead: false,
      createdAt: '2026-01-06T10:00:00.000Z'
    },
    /* Nour notified about assignment in board_2 */
    {
      id: 'notif_4',
      userId: 'user_3',
      type: 'card_assigned',
      message: "You've been assigned to \"E2E tests for login & onboarding\" on Mobile App MVP",
      relatedEntityId: 'card_2_3_1',
      isRead: false,
      createdAt: '2026-04-12T11:00:00.000Z'
    },
    /* Lina notified about assignment in board_3 */
    {
      id: 'notif_5',
      userId: 'user_5',
      type: 'card_assigned',
      message: "You've been assigned to \"Q2 content calendar\" on Marketing Q2 Campaign",
      relatedEntityId: 'card_3_2_1',
      isRead: false,
      createdAt: '2026-04-13T08:30:00.000Z'
    },
    /* Sara notified about a deadline approaching */
    {
      id: 'notif_6',
      userId: 'user_1',
      type: 'deadline_approaching',
      message: '"New homepage hero section" is due tomorrow',
      relatedEntityId: 'card_1_3_1',
      isRead: false,
      createdAt: '2026-04-19T07:00:00.000Z'
    },
    /* Omar — board invitation to board_4 */
    {
      id: 'notif_7',
      userId: 'user_2',
      type: 'board_invitation',
      message: 'Khaled Mostafa invited you to join "DevOps & Infrastructure"',
      relatedEntityId: 'board_4',
      isRead: true,
      createdAt: '2026-01-11T10:00:00.000Z'
    }
  ]
};
