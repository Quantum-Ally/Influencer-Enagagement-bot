export const emailTemplates = {
  meeting: [
    {
      id: 'meeting-1',
      name: 'Initial Meeting Request',
      category: 'meeting',
      subject: 'Collaboration Meeting Request',
      description: 'I would like to schedule a meeting to discuss a potential collaboration opportunity. Would you be available for a 30-minute call this week?',
      priority: 'high'
    },
    {
      id: 'meeting-2',
      name: 'Follow-up Meeting',
      category: 'meeting',
      subject: 'Follow-up Meeting Request',
      description: 'Following up on our previous conversation. I would like to schedule a follow-up meeting to discuss the next steps.',
      priority: 'medium'
    }
  ],
  negotiation: [
    {
      id: 'negotiation-1',
      name: 'Partnership Proposal',
      category: 'negotiation',
      subject: 'Partnership Opportunity Discussion',
      description: 'I would like to discuss a partnership opportunity that could be mutually beneficial. Let\'s schedule a call to explore this further.',
      priority: 'high'
    },
    {
      id: 'negotiation-2',
      name: 'Terms Discussion',
      category: 'negotiation',
      subject: 'Discussion on Collaboration Terms',
      description: 'I would like to discuss the terms and conditions for our upcoming collaboration. Please let me know your availability.',
      priority: 'high'
    }
  ],
  'follow-up': [
    {
      id: 'followup-1',
      name: 'Check-in Follow-up',
      category: 'follow-up',
      subject: 'Following Up on Our Conversation',
      description: 'Just checking in to see if you had a chance to review my previous message. I would love to hear your thoughts.',
      priority: 'medium'
    },
    {
      id: 'followup-2',
      name: 'Reminder Follow-up',
      category: 'follow-up',
      subject: 'Gentle Reminder',
      description: 'This is a gentle reminder about our previous discussion. Please let me know if you need any additional information.',
      priority: 'low'
    }
  ],
  collaboration: [
    {
      id: 'collab-1',
      name: 'Brand Collaboration',
      category: 'collaboration',
      subject: 'Brand Collaboration Opportunity',
      description: 'We would love to collaborate with you on an exciting new project. This could be a great opportunity for both of us.',
      priority: 'high'
    },
    {
      id: 'collab-2',
      name: 'Content Partnership',
      category: 'collaboration',
      subject: 'Content Partnership Proposal',
      description: 'I would like to propose a content partnership that aligns with your brand values and audience interests.',
      priority: 'medium'
    }
  ]
}

export const getAllTemplates = () => {
  return Object.values(emailTemplates).flat()
}

export const getTemplatesByCategory = (category) => {
  return emailTemplates[category] || []
}

