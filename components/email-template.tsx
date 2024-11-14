import { useCookie } from "@/hooks/use-cookie";

interface EmailTemplateProps {
  name: string;
  issue: string;
  url: string;
}

const project = useCookie("project");

const AssignIssueEmailTemplate = ({ name, issue, url }: EmailTemplateProps) => `
  <html>
    <head>
      <style>
        /* Add some basic responsive styles */
        @media (max-width: 767px) {
          .container {
            width: 90%;
          }
        }
        @media (min-width: 768px) {
          .container {
            width: 600px;
          }
        }
        .container {
          margin: 20px auto;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 24px;
          font-family: Arial, sans-serif;
          color: #4a5568;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .header h2 {
          color: #4c51bf;
          font-size: 20px;
          font-weight: bold;
          margin: 0;
        }
        .issue-details {
          background-color: #f0f4ff;
          border-radius: 6px;
          padding: 12px;
          font-weight: bold;
          color: #4a5568;
          margin-bottom: 16px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 15px 0;
        }
        .footer {
          text-align: right;
          color: #718096;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Issue Assignment Notification</h2>
        </div>
        <p>Hello ${name},</p>
        <p>You have been assigned a new issue:</p>
        <div class="issue-details">${issue}</div>
        <a href="${url}" class="button">View Issue</a>
        <p>Please check your project dashboard for more details.</p>
        <div class="footer">
          <p>Best regards,</p>
          <p>Project Team</p>
        </div>
      </div>
    </body>
  </html>
`;

const WelcomeNewMemberTemplate = ({
  name,
  Url,
}: {
  name: string;
  Url: string;
}) =>
  `
    <html>
      <head>
        <style>
          @media (max-width: 767px) {
            .container {
              width: 90%;
            }
          }
          @media (min-width: 768px) {
            .container {
              width: 600px;
            }
          }
          .container {
            margin: 20px auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 24px;
            font-family: Arial, sans-serif;
            color: #4a5568;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          .header h2 {
            color: #4c51bf;
            font-size: 20px;
            font-weight: bold;
            margin: 0;
          }
          .project-details {
            background-color: #f0f4ff;
            border-radius: 6px;
            padding: 12px;
            font-weight: bold;
            color: #4a5568;
            margin-bottom: 16px;
          }
          .footer {
            text-align: right;
            color: #718096;
            font-style: italic;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Welcome to the Project!</h2>
          </div>
          <p>Dear ${name},</p>
          <p>We're excited to have you join our team for the "${project.name}" project.</p>
          <a href="${Url}" class="button">Accept Invite</a>
          <div class="project-details">
            We're looking forward to working with you and contributing to the success of this important initiative.
          </div>
          <p>If you have any questions or need assistance, please don't hesitate to reach out to your project manager or the team.</p>
          <div class="footer">
            <p>Best regards,</p>
            <p>Project Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

export { AssignIssueEmailTemplate, WelcomeNewMemberTemplate };
