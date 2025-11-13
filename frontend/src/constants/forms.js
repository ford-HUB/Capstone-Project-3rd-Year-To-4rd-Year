// Sample data - In real app, this would come from API
export const SAMPLE_FORMS = [
  {
    id: 1,
    title: "System Feedback",
    description: "Collect user satisfaction feedback",
    fields: [
      { type: "text", label: "Name", required: true },
      { type: "email", label: "Email", required: true },
      { type: "radio", label: "Overall Rating", options: ["Excellent", "Good", "Average", "Poor"] },
      { type: "textarea", label: "Comments" }
    ],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
    responses: 45,
    status: "published",
    category: "feedback",
    shareUrl: "https://forms.company.com/feedback-survey"
  },
  {
    id: 2,
    title: "Event Evaluation Form",
    description: "Collect event evaluation",
    fields: [
      { type: "text", label: "Full Name", required: true },
      { type: "email", label: "Email", required: true },
      { type: "phone", label: "Phone Number" },
      { type: "file", label: "Resume", required: true },
      { type: "select", label: "Position", options: ["Developer", "Designer", "Manager"] }
    ],
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-12T11:30:00Z",
    responses: 23,
    status: "published",
    category: "hr",
    shareUrl: "https://forms.company.com/job-application"
  },
  {
    id: 4,
    title: "Training Program Evaluation Form",
    description: "Collect event program evaluation form",
    fields: [
      { type: "text", label: "Company Name", required: true },
      { type: "email", label: "Contact Email", required: true },
      { type: "select", label: "Product Interest", options: ["Software", "Hardware", "Consulting"] },
      { type: "number", label: "Expected Budget" }
    ],
    createdAt: "2024-01-05T13:20:00Z",
    updatedAt: "2024-01-07T10:15:00Z",
    responses: 8,
    status: "archived",
    category: "sales",
    shareUrl: "https://forms.company.com/product-inquiry"
  }
];

// Sample response data
export const SAMPLE_RESPONSES = {
  1: [
    { id: 1, submittedAt: "2024-01-20T10:30:00Z", data: { "Name": "Anonymous", "Email": "Anonymous@gmail.com", "Overall Rating": "Excellent", "Comments": "Great service!" } },
    { id: 2, submittedAt: "2024-01-19T14:20:00Z", data: { "Name": "Anonymous", "Email": "Anonymous@gmail.com", "Overall Rating": "Good", "Comments": "Could be better" } }
  ],
  2: [
    { id: 1, submittedAt: "2024-01-18T09:15:00Z", data: { "Full Name": "Anonymous", "Email": "Anonymous@gmail.com", "Phone Number": "555-0123", "Position": "Developer" } }
  ]
};

// Form categories
export const FORM_CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "feedback", label: "Feedback" },
  { value: "hr", label: "HR" },
  { value: "events", label: "Events" },
  { value: "sales", label: "Sales" }
];

// Form statuses
export const FORM_STATUSES = [
  { value: "all", label: "All Status" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" }
];

// Sort options
export const SORT_OPTIONS = [
  { value: "updated", label: "Last Updated" },
  { value: "created", label: "Date Created" },
  { value: "title", label: "Title A-Z" },
  { value: "responses", label: "Most Responses" }
];
