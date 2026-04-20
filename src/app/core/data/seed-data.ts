export const SEED_DATA = {
  users: [
    {
      id: 'user_1',
      name: 'Hazem Ahmed',
      email: 'hazem@taskflow.io',
      password: 'hazem123',
      role: 'member',
      avatar: 'https://i.pravatar.cc/150?img=11',
      createdAt: '2025-12-01T00:00:00.000Z'
    },
    {
      id: 'user_2',
      name: 'Khaled Ashraf',
      email: 'khaled@taskflow.io',
      password: 'khaled123',
      role: 'member',
      avatar: 'https://i.pravatar.cc/150?img=12',
      createdAt: '2025-12-05T00:00:00.000Z'
    },
    {
      id: 'user_3',
      name: 'Sara Hassan',
      email: 'sara@taskflow.io',
      password: 'sara123',
      role: 'member',
      avatar: 'https://i.pravatar.cc/150?img=5',
      createdAt: '2025-12-10T00:00:00.000Z'
    },
    {
      id: 'user_4',
      name: 'Ahmed Mostafa',
      email: 'ahmed@taskflow.io',
      password: 'ahmed123',
      role: 'member',
      avatar: 'https://i.pravatar.cc/150?img=15',
      createdAt: '2025-12-15T00:00:00.000Z'
    },
    {
      id: 'user_5',
      name: 'Demo User',
      email: 'demo@taskflow.io',
      password: 'demo123',
      role: 'member',
      avatar: 'https://i.pravatar.cc/150?img=8',
      createdAt: '2025-12-20T00:00:00.000Z'
    }
  ],

  boards: [
    {
      id: 'board_1',
      title: 'Project Alpha',
      description: 'Main engineering project board for Q1 deliverables',
      ownerId: 'user_1',
      members: ['user_1', 'user_2', 'user_3'],
      backgroundColor: '#4f46e5',
      isStarred: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
      lists: [
        {
          id: 'list_1_1',
          title: 'Backlog',
          boardId: 'board_1',
          position: 0,
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          cards: [
            {
              id: 'card_1_1_1',
              title: 'Set up project repository',
              description: 'Initialize Git repo, add .gitignore and README',
              listId: 'list_1_1',
              boardId: 'board_1',
              assignedUsers: ['user_1'],
              priority: 'high',
              deadline: '2026-02-15T00:00:00.000Z',
              createdAt: '2026-01-02T00:00:00.000Z',
              updatedAt: '2026-01-02T00:00:00.000Z',
              position: 0,
              labels: ['setup', 'devops'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_1_1_2',
              title: 'Define API contracts',
              description: 'Draft OpenAPI spec for all endpoints before implementation begins',
              listId: 'list_1_1',
              boardId: 'board_1',
              assignedUsers: ['user_2'],
              priority: 'medium',
              deadline: null,
              createdAt: '2026-01-03T00:00:00.000Z',
              updatedAt: '2026-01-03T00:00:00.000Z',
              position: 1,
              labels: ['api', 'design'],
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
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          cards: [
            {
              id: 'card_1_2_1',
              title: 'Build authentication module',
              description: 'Implement JWT-based login, register, and token refresh flows',
              listId: 'list_1_2',
              boardId: 'board_1',
              assignedUsers: ['user_1', 'user_2'],
              priority: 'urgent',
              deadline: '2026-02-10T00:00:00.000Z',
              createdAt: '2026-01-05T00:00:00.000Z',
              updatedAt: '2026-01-05T00:00:00.000Z',
              position: 0,
              labels: ['auth', 'backend'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_1_2_2',
              title: 'Design dashboard wireframes',
              description: 'Create high-fidelity Figma mockups for the main dashboard screens',
              listId: 'list_1_2',
              boardId: 'board_1',
              assignedUsers: ['user_3'],
              priority: 'medium',
              deadline: null,
              createdAt: '2026-01-06T00:00:00.000Z',
              updatedAt: '2026-01-06T00:00:00.000Z',
              position: 1,
              labels: ['design', 'ui'],
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
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          cards: [
            {
              id: 'card_1_3_1',
              title: 'Code review: user profile page',
              description: 'Review PR #14 for the user profile page implementation',
              listId: 'list_1_3',
              boardId: 'board_1',
              assignedUsers: ['user_1'],
              priority: 'low',
              deadline: null,
              createdAt: '2026-01-07T00:00:00.000Z',
              updatedAt: '2026-01-07T00:00:00.000Z',
              position: 0,
              labels: ['review'],
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
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          cards: [
            {
              id: 'card_1_4_1',
              title: 'Project kickoff meeting',
              description: 'Schedule and run the project kickoff with all stakeholders',
              listId: 'list_1_4',
              boardId: 'board_1',
              assignedUsers: ['user_1', 'user_2', 'user_3'],
              priority: 'high',
              deadline: '2026-01-05T00:00:00.000Z',
              createdAt: '2026-01-01T00:00:00.000Z',
              updatedAt: '2026-01-05T00:00:00.000Z',
              position: 0,
              labels: ['meeting'],
              comments: [],
              attachments: []
            }
          ]
        }
      ]
    },
    {
      id: 'board_2',
      title: 'Marketing Campaign Q1',
      description: 'Q1 2026 marketing initiatives and campaigns',
      ownerId: 'user_1',
      members: ['user_1', 'user_4'],
      backgroundColor: '#d97706',
      isStarred: false,
      createdAt: '2026-01-15T00:00:00.000Z',
      updatedAt: '2026-01-15T00:00:00.000Z',
      lists: [
        {
          id: 'list_2_1',
          title: 'Ideas',
          boardId: 'board_2',
          position: 0,
          createdAt: '2026-01-15T00:00:00.000Z',
          updatedAt: '2026-01-15T00:00:00.000Z',
          cards: [
            {
              id: 'card_2_1_1',
              title: 'Social media influencer outreach',
              description: 'Identify and contact relevant tech influencers for potential partnerships',
              listId: 'list_2_1',
              boardId: 'board_2',
              assignedUsers: ['user_4'],
              priority: 'low',
              deadline: null,
              createdAt: '2026-01-16T00:00:00.000Z',
              updatedAt: '2026-01-16T00:00:00.000Z',
              position: 0,
              labels: ['social', 'outreach'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_2_2',
          title: 'Planning',
          boardId: 'board_2',
          position: 1,
          createdAt: '2026-01-15T00:00:00.000Z',
          updatedAt: '2026-01-15T00:00:00.000Z',
          cards: [
            {
              id: 'card_2_2_1',
              title: 'Q1 content calendar',
              description: 'Plan and schedule all blog posts, newsletters, and social content for Q1',
              listId: 'list_2_2',
              boardId: 'board_2',
              assignedUsers: ['user_1', 'user_4'],
              priority: 'high',
              deadline: '2026-01-31T00:00:00.000Z',
              createdAt: '2026-01-16T00:00:00.000Z',
              updatedAt: '2026-01-16T00:00:00.000Z',
              position: 0,
              labels: ['content', 'planning'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_2_3',
          title: 'Execution',
          boardId: 'board_2',
          position: 2,
          createdAt: '2026-01-15T00:00:00.000Z',
          updatedAt: '2026-01-15T00:00:00.000Z',
          cards: []
        },
        {
          id: 'list_2_4',
          title: 'Completed',
          boardId: 'board_2',
          position: 3,
          createdAt: '2026-01-15T00:00:00.000Z',
          updatedAt: '2026-01-15T00:00:00.000Z',
          cards: [
            {
              id: 'card_2_4_1',
              title: 'Brand identity refresh',
              description: 'Update logo, color palette, and typography guidelines',
              listId: 'list_2_4',
              boardId: 'board_2',
              assignedUsers: ['user_4'],
              priority: 'high',
              deadline: '2026-01-20T00:00:00.000Z',
              createdAt: '2026-01-15T00:00:00.000Z',
              updatedAt: '2026-01-20T00:00:00.000Z',
              position: 0,
              labels: ['branding'],
              comments: [],
              attachments: []
            }
          ]
        }
      ]
    },
    {
      id: 'board_3',
      title: 'Personal Task Tracker',
      description: "Khaled's personal productivity board",
      ownerId: 'user_2',
      members: ['user_2'],
      backgroundColor: '#059669',
      isStarred: true,
      createdAt: '2026-01-20T00:00:00.000Z',
      updatedAt: '2026-01-20T00:00:00.000Z',
      lists: [
        {
          id: 'list_3_1',
          title: 'To Do',
          boardId: 'board_3',
          position: 0,
          createdAt: '2026-01-20T00:00:00.000Z',
          updatedAt: '2026-01-20T00:00:00.000Z',
          cards: [
            {
              id: 'card_3_1_1',
              title: 'Read Clean Architecture book',
              description: 'Finish reading chapters 8–12 on SOLID principles',
              listId: 'list_3_1',
              boardId: 'board_3',
              assignedUsers: ['user_2'],
              priority: 'low',
              deadline: null,
              createdAt: '2026-01-21T00:00:00.000Z',
              updatedAt: '2026-01-21T00:00:00.000Z',
              position: 0,
              labels: ['learning'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_3_1_2',
              title: 'Prepare technical interview',
              description: 'Practice LeetCode problems and system design questions',
              listId: 'list_3_1',
              boardId: 'board_3',
              assignedUsers: ['user_2'],
              priority: 'urgent',
              deadline: '2026-02-20T00:00:00.000Z',
              createdAt: '2026-01-22T00:00:00.000Z',
              updatedAt: '2026-01-22T00:00:00.000Z',
              position: 1,
              labels: ['career'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_3_2',
          title: 'Doing',
          boardId: 'board_3',
          position: 1,
          createdAt: '2026-01-20T00:00:00.000Z',
          updatedAt: '2026-01-20T00:00:00.000Z',
          cards: [
            {
              id: 'card_3_2_1',
              title: 'Angular advanced course',
              description: 'Complete the signals and zoneless change detection modules',
              listId: 'list_3_2',
              boardId: 'board_3',
              assignedUsers: ['user_2'],
              priority: 'high',
              deadline: '2026-02-28T00:00:00.000Z',
              createdAt: '2026-01-23T00:00:00.000Z',
              updatedAt: '2026-01-23T00:00:00.000Z',
              position: 0,
              labels: ['learning', 'angular'],
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
          createdAt: '2026-01-20T00:00:00.000Z',
          updatedAt: '2026-01-20T00:00:00.000Z',
          cards: [
            {
              id: 'card_3_3_1',
              title: 'Set up home dev environment',
              description: 'Install WSL2, Docker, Node.js, and configure VS Code properly',
              listId: 'list_3_3',
              boardId: 'board_3',
              assignedUsers: ['user_2'],
              priority: 'medium',
              deadline: null,
              createdAt: '2026-01-20T00:00:00.000Z',
              updatedAt: '2026-01-20T00:00:00.000Z',
              position: 0,
              labels: ['setup'],
              comments: [],
              attachments: []
            }
          ]
        }
      ]
    },
    {
      id: 'board_4',
      title: 'Design System v2',
      description: 'Building a unified component library and design tokens across all products',
      ownerId: 'user_3',
      members: ['user_1', 'user_3', 'user_4'],
      backgroundColor: '#7c3aed',
      isStarred: false,
      createdAt: '2026-02-01T00:00:00.000Z',
      updatedAt: '2026-02-01T00:00:00.000Z',
      lists: [
        {
          id: 'list_4_1',
          title: 'Research',
          boardId: 'board_4',
          position: 0,
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: '2026-02-01T00:00:00.000Z',
          cards: [
            {
              id: 'card_4_1_1',
              title: 'Audit existing components',
              description: 'Document all currently used UI components and identify inconsistencies',
              listId: 'list_4_1',
              boardId: 'board_4',
              assignedUsers: ['user_3'],
              priority: 'high',
              deadline: '2026-02-20T00:00:00.000Z',
              createdAt: '2026-02-02T00:00:00.000Z',
              updatedAt: '2026-02-02T00:00:00.000Z',
              position: 0,
              labels: ['design', 'audit'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_4_1_2',
              title: 'Competitive analysis',
              description: 'Review design systems from Atlassian, Shopify Polaris, and MUI',
              listId: 'list_4_1',
              boardId: 'board_4',
              assignedUsers: ['user_4'],
              priority: 'medium',
              deadline: null,
              createdAt: '2026-02-03T00:00:00.000Z',
              updatedAt: '2026-02-03T00:00:00.000Z',
              position: 1,
              labels: ['research'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_4_2',
          title: 'In Design',
          boardId: 'board_4',
          position: 1,
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: '2026-02-01T00:00:00.000Z',
          cards: [
            {
              id: 'card_4_2_1',
              title: 'Token system — colors & typography',
              description: 'Define all color tokens, font scales, and spacing units in Figma',
              listId: 'list_4_2',
              boardId: 'board_4',
              assignedUsers: ['user_3', 'user_1'],
              priority: 'urgent',
              deadline: '2026-03-01T00:00:00.000Z',
              createdAt: '2026-02-05T00:00:00.000Z',
              updatedAt: '2026-02-05T00:00:00.000Z',
              position: 0,
              labels: ['design', 'tokens'],
              comments: [],
              attachments: []
            }
          ]
        },
        {
          id: 'list_4_3',
          title: 'In Development',
          boardId: 'board_4',
          position: 2,
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: '2026-02-01T00:00:00.000Z',
          cards: [
            {
              id: 'card_4_3_1',
              title: 'Button component variants',
              description: 'Primary, secondary, ghost, danger — all sizes and states',
              listId: 'list_4_3',
              boardId: 'board_4',
              assignedUsers: ['user_1'],
              priority: 'high',
              deadline: '2026-03-10T00:00:00.000Z',
              createdAt: '2026-02-06T00:00:00.000Z',
              updatedAt: '2026-02-06T00:00:00.000Z',
              position: 0,
              labels: ['frontend', 'component'],
              comments: [],
              attachments: []
            }
          ]
        }
      ]
    },
    {
      id: 'board_5',
      title: 'DevOps & Infrastructure',
      description: 'CI/CD pipelines, cloud deployment, monitoring, and security hardening',
      ownerId: 'user_1',
      members: ['user_1', 'user_2'],
      backgroundColor: '#0f766e',
      isStarred: true,
      createdAt: '2026-02-10T00:00:00.000Z',
      updatedAt: '2026-02-10T00:00:00.000Z',
      lists: [
        {
          id: 'list_5_1',
          title: 'Planned',
          boardId: 'board_5',
          position: 0,
          createdAt: '2026-02-10T00:00:00.000Z',
          updatedAt: '2026-02-10T00:00:00.000Z',
          cards: [
            {
              id: 'card_5_1_1',
              title: 'Set up GitHub Actions pipeline',
              description: 'Automate build, test, and deploy stages for all services',
              listId: 'list_5_1',
              boardId: 'board_5',
              assignedUsers: ['user_2'],
              priority: 'urgent',
              deadline: '2026-02-28T00:00:00.000Z',
              createdAt: '2026-02-11T00:00:00.000Z',
              updatedAt: '2026-02-11T00:00:00.000Z',
              position: 0,
              labels: ['devops', 'ci-cd'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_5_1_2',
              title: 'Kubernetes cluster setup',
              description: 'Configure EKS cluster with auto-scaling node groups',
              listId: 'list_5_1',
              boardId: 'board_5',
              assignedUsers: ['user_1'],
              priority: 'high',
              deadline: '2026-03-15T00:00:00.000Z',
              createdAt: '2026-02-12T00:00:00.000Z',
              updatedAt: '2026-02-12T00:00:00.000Z',
              position: 1,
              labels: ['devops', 'infrastructure'],
              comments: [],
              attachments: []
            },
            {
              id: 'card_5_1_3',
              title: 'Security audit & pen testing',
              description: 'Schedule external security audit and fix all critical findings',
              listId: 'list_5_1',
              boardId: 'board_5',
              assignedUsers: ['user_1', 'user_2'],
              priority: 'urgent',
              deadline: '2026-03-05T00:00:00.000Z',
              createdAt: '2026-02-13T00:00:00.000Z',
              updatedAt: '2026-02-13T00:00:00.000Z',
              position: 2,
              labels: ['security'],
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
          createdAt: '2026-02-10T00:00:00.000Z',
          updatedAt: '2026-02-10T00:00:00.000Z',
          cards: [
            {
              id: 'card_5_2_1',
              title: 'Monitoring with Grafana + Prometheus',
              description: 'Set up dashboards for API latency, error rates, and infra health',
              listId: 'list_5_2',
              boardId: 'board_5',
              assignedUsers: ['user_2'],
              priority: 'medium',
              deadline: null,
              createdAt: '2026-02-14T00:00:00.000Z',
              updatedAt: '2026-02-14T00:00:00.000Z',
              position: 0,
              labels: ['monitoring'],
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
          createdAt: '2026-02-10T00:00:00.000Z',
          updatedAt: '2026-02-10T00:00:00.000Z',
          cards: [
            {
              id: 'card_5_3_1',
              title: 'Docker containerisation',
              description: 'Containerise all microservices with optimised multi-stage builds',
              listId: 'list_5_3',
              boardId: 'board_5',
              assignedUsers: ['user_1'],
              priority: 'high',
              deadline: '2026-02-15T00:00:00.000Z',
              createdAt: '2026-02-10T00:00:00.000Z',
              updatedAt: '2026-02-15T00:00:00.000Z',
              position: 0,
              labels: ['devops'],
              comments: [],
              attachments: []
            }
          ]
        }
      ]
    }
  ],

  notifications: [
    {
      id: 'notif_1',
      userId: 'user_1',
      type: 'card_assigned',
      title: 'New Card Assignment',
      message: 'You have been assigned to "Build authentication module"',
      relatedEntityId: 'card_1_2_1',
      isRead: false,
      createdAt: '2026-01-05T09:00:00.000Z'
    },
    {
      id: 'notif_2',
      userId: 'user_1',
      type: 'board_invitation',
      title: 'Board Invitation',
      message: 'Khaled Ashraf joined "Project Alpha"',
      relatedEntityId: 'board_1',
      isRead: true,
      createdAt: '2026-01-03T10:00:00.000Z'
    },
    {
      id: 'notif_3',
      userId: 'user_2',
      type: 'card_assigned',
      title: 'New Card Assignment',
      message: 'You have been assigned to "Define API contracts"',
      relatedEntityId: 'card_1_1_2',
      isRead: false,
      createdAt: '2026-01-04T08:30:00.000Z'
    },
    {
      id: 'notif_4',
      userId: 'user_2',
      type: 'deadline_approaching',
      title: 'Deadline Approaching',
      message: '"Prepare technical interview" is due in 2 days',
      relatedEntityId: 'card_3_1_2',
      isRead: false,
      createdAt: '2026-01-06T07:00:00.000Z'
    }
  ]
};
