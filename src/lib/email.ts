import { Resend } from "resend";
import { getAgentWelcomeEmailHtml, getLeadConfirmationEmailHtml, getWelcomeEmailHtml } from "./email-templates";

const resend = new Resend(process.env.RESEND_API_KEY!);

const BOOKINGS_EMAIL = "Budget Travel Packages <booking@budgettravelpackages.in>";
const HELLO_EMAIL = "Budget Travel Packages <hello@budgettravelpackages.in>";
const NOREPLY_EMAIL = "Budget Travel Packages <noreply@budgettravelpackages.in>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@budgettravelpackages.in";

// --- Email Templates (Shared Styles) ---

const styles = {
  container: `
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08); /* More subtle, deeper shadow */
    border: 1px solid #eaeaea; /* Light border */
  `,
  header: `
    background-color: #000000; /* Black Header */
    padding: 30px;
    text-align: center;
    border-bottom: 3px solid #01ff70; /* Neon Green Accent */
  `,
  headerTitle: `
    color: #ffffff;
    margin: 0;
    font-size: 26px; /* Slightly larger */
    font-weight: 800;
    letter-spacing: -0.5px;
    text-transform: uppercase;
  `,
  body: `
    padding: 40px 30px;
    color: #333333;
    line-height: 1.7; /* Increased line-height for readability */
  `,
  h2: `
    color: #111111;
    font-size: 22px;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 24px; /* More spacing */
    letter-spacing: -0.3px;
  `,
  p: `
    margin-bottom: 18px; /* More spacing */
    font-size: 16px;
    color: #555555; /* Softer text color */
  `,
  dataBox: `
    background-color: #f9f9f9; /* Very light gray */
    border-radius: 8px;
    padding: 24px;
    margin: 30px 0;
    border-left: 4px solid #01ff70;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  `,
  dataItem: `
    margin: 10px 0;
    font-size: 15px;
    color: #444; /* Slightly darker than p */
    display: flex; /* Ideally, but reliable styles are inline-block or block */
  `,
  button: `
    display: inline-block;
    background-color: #01ff70;
    color: #000000;
    padding: 14px 28px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 700; /* Bold */
    font-size: 16px;
    margin-top: 24px;
    text-align: center;
    letter-spacing: 0.5px;
    transition: background-color 0.2s ease;
  `,
  footer: `
    background-color: #f5f5f5;
    padding: 24px 20px;
    text-align: center;
    border-top: 1px solid #eeeeee;
    font-size: 13px;
    color: #888888;
    line-height: 1.5;
  `,
  accentText: `
    color: #000;
    font-weight: 600;
  `,
};

// --- Interfaces ---

interface WelcomeEmailProps {
  name: string;
  email: string;
  password?: string; // Optional for user welcome email
  to: string;
}

interface LeadConfirmationProps {
  name: string;
  email: string;
  phone: string;
  destination: string;
  budget: number;
  guests: number;
}

interface LeadNotificationProps {
  name: string;
  email: string;
  phone: string;
  destination: string;
  budget: number;
  guests: number;
}

interface OtpEmailProps {
  email: string;
  otp: string;
}

// --- Email Functions ---

// 1. Send General Welcome Email (From HELLO_EMAIL)
export async function sendWelcomeEmail({
  name,
  to,
}: {
  name: string;
  to: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: HELLO_EMAIL,
      to: [to],
      subject: "Welcome to Budget Travel Packages! 🌍",
      html: getWelcomeEmailHtml(name),
    });

    if (error) {
      console.error("Resend Error (User Welcome):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (User Welcome):", error);
    return { success: false, error };
  }
}

// 1b. Send Set Password Email (From NOREPLY_EMAIL)
export async function sendSetPasswordEmail({
  name,
  email,
  setPasswordUrl,
}: {
  name: string;
  email: string;
  setPasswordUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: [email],
      subject: "Set Your Password - Budget Travel Packages 🔒",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Budget Travel Packages</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${name},</h2>
            <p style="${styles.p}">We've created a personal dashboard for you to track your bookings, view updates, and manage payments.</p>
            <p style="${styles.p}">Please click the button below to set your password and activate your account:</p>
            <div style="text-align: center;">
              <a href="${setPasswordUrl}" style="${styles.button}">Set Your Password</a>
            </div>
            <p style="font-size: 13px; color: #888; margin-top: 24px; text-align: center;">This link expires in 72 hours.</p>
          </div>
          <div style="${styles.footer}">
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Set Password):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Set Password):", error);
    return { success: false, error };
  }
}

// 2. Agent Welcome Email (From ADMIN/BOOKINGS - typically system generated)
// Keeping as is functionally, but updating styles.
export async function sendAgentWelcomeEmail({
  name,
  email,
  password,
  to,
}: WelcomeEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL, // Or could be a dedicated admin email, but keeping it simple
      to: [to],
      subject: "Welcome to Budget Travel Packages Admin Panel",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Admin Portal Access</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Welcome, ${name}!</h2>
            <p style="${styles.p}">You have been granted access to the Budget Travel Packages admin panel as an Agent.</p>
            <p style="${styles.p}">Please use the credentials below to log in securely:</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Email:</strong> ${email}</p>
              <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Password:</strong> ${password}</p>
            </div>
            
            <p style="${styles.p}">For security reasons, we recommend changing your password immediately after your first login.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/" style="${styles.button}">Login to Dashboard</a>
            </div>
          </div>
          <div style="${styles.footer}">
            <p>This is a system-generated email. Please do not reply.</p>
            <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Agent Welcome):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Agent Welcome):", error);
    return { success: false, error };
  }
}

// 2b. Agent Promotion Email (For existing customers)
export async function sendAgentPromotionEmail({
  name,
  email,
  to,
}: {
  name: string;
  email: string;
  to: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL,
      to: [to],
      subject: "New Privileges: Agent Access Granted",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Agent Access Granted</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello, ${name}!</h2>
            <p style="${styles.p}">Good news! Your Budget Travel Packages account has been upgraded with Agent privileges.</p>
            <p style="${styles.p}">You can now manage leads and access the admin portal using your existing login credentials:</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Email:</strong> ${email}</p>
              <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Password:</strong> (Use your existing password)</p>
            </div>
            
            <p style="${styles.p}">You will now see more options when you log in to the portal.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/" style="${styles.button}">Access Admin Portal</a>
            </div>
          </div>
          <div style="${styles.footer}">
            <p>Budget Travel Admin Notification System</p>
            <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Agent Promotion):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Agent Promotion):", error);
    return { success: false, error };
  }
}

// 3. User Lead Confirmation Email (From BOOKINGS_EMAIL)
export async function sendLeadConfirmationEmail({
  name,
  email,
  phone,
  destination,
  budget,
  guests,
}: LeadConfirmationProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL,
      to: [email],
      subject: `Booking Received: Trip to ${destination} ✈️`,
      html: getLeadConfirmationEmailHtml(name, destination, guests, budget.toString(), phone),
    });

    if (error) {
      console.error("Resend Error (Confirmation):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Confirmation):", error);
    return { success: false, error };
  }
}

// 4. Admin New Lead Notification (From BOOKINGS_EMAIL)
export async function sendLeadNotificationEmail({
  name,
  email,
  phone,
  destination,
  budget,
  guests,
}: LeadNotificationProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL, // Send notification from system email
      to: [ADMIN_EMAIL],
      subject: `New Lead Alert: ${name} - ${destination} 🔔`,
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">New Lead Received</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">A new inquiry has been submitted!</h2>
            <p style="${styles.p}">A potential customer is interested in a trip to <strong style="${styles.accentText}">${destination}</strong>. Please follow up promptly.</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Customer:</strong> ${name}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Email:</strong> <a href="mailto:${email}" style="color: #333; text-decoration: underline;">${email}</a></p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Phone:</strong> <a href="tel:${phone}" style="color: #333; text-decoration: underline;">${phone}</a></p>
              <div style="border-top: 1px solid #e5e5e5; margin: 12px 0;"></div>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Destination:</strong> ${destination}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Budget:</strong> ₹${budget}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Guests:</strong> ${guests}</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/admin/leads" style="${styles.button}">View Lead in Dashboard</a>
            </div>
          </div>
          <div style="${styles.footer}">
            <p>Budget Travel Admin Notification System</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Notification):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Notification):", error);
    return { success: false, error };
  }
}

// 5. Send OTP Email (From HELLO_EMAIL)
export async function sendOtpEmail({ email, otp }: OtpEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: HELLO_EMAIL,
      to: [email],
      subject: "Password Reset OTP - Budget Travel Packages 🔒",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Password Reset</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello,</h2>
            <p style="${styles.p}">You requested to reset your password. Please use the OTP below to proceed.</p>
            
            <div style="${styles.dataBox}; text-align: center;">
              <p style="${styles.p}; margin-bottom: 8px;">Your One-Time Password (OTP) is:</p>
              <h1 style="color: #000; font-size: 32px; letter-spacing: 4px; margin: 10px 0;">${otp}</h1>
            </div>

            <p style="${styles.p}">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
            <p style="${styles.p}">If you did not request this, please ignore this email.</p>
            
            <p style="${styles.p}">Warm regards,<br/>The Budget Travel Team</p>
          </div>
          <div style="${styles.footer}">
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (OTP):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (OTP):", error);
    return { success: false, error };
  }
}

// 6. Send Agent Onboarding Email (From HELLO_EMAIL)
export async function sendAgentOnboardingEmail({
  name,
  to,
  onboardingUrl,
}: {
  name: string;
  to: string;
  onboardingUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: [to],
      subject: "Complete Your Agent Registration - Budget Travel Packages ✈️",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Welcome Aboard!</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${name},</h2>
            <p style="${styles.p}">Thank you for registering as a travel agent with Budget Travel Packages. To complete your registration, click the button below.</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.p}; margin-bottom: 8px;">You will need:</p>
              <p style="${styles.p}; margin: 4px 0;">• Your personal details (name, phone, address)</p>
              <p style="${styles.p}; margin: 4px 0;">• Aadhaar card for photo capture</p>
              <p style="${styles.p}; margin: 4px 0;">• PAN card for photo capture</p>
              <p style="${styles.p}; margin: 4px 0;">• A webcam for face verification</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${onboardingUrl}" style="${styles.button}">Complete Registration</a>
            </div>

            <p style="${styles.p}">This link is valid for 72 hours. After completing your profile, an admin will review and verify your account.</p>
            <p style="${styles.p}">If you did not register, please ignore this email.</p>
            
            <p style="${styles.p}">Warm regards,<br/>The Budget Travel Team</p>
          </div>
          <div style="${styles.footer}">
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Agent Onboarding):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Agent Onboarding):", error);
    return { success: false, error };
  }
}

// 7. Send Admin Notification for Agent Verification (From BOOKINGS_EMAIL)
export async function sendAgentVerificationNotification({
  agentName,
  agentEmail,
  agentPhone,
  agentGender,
  agentAge,
}: {
  agentName: string;
  agentEmail: string;
  agentPhone?: string;
  agentGender?: string;
  agentAge?: number;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL,
      to: [ADMIN_EMAIL],
      subject: `New Agent Pending Verification - ${agentName}`,
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">New Agent Registration</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Agent Verification Required</h2>
            <p style="${styles.p}">A new agent has completed onboarding and is pending verification.</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><span style="${styles.accentText}">Name:</span> ${agentName}</p>
              <p style="${styles.dataItem}"><span style="${styles.accentText}">Email:</span> ${agentEmail}</p>
              ${agentPhone ? `<p style="${styles.dataItem}"><span style="${styles.accentText}">Phone:</span> ${agentPhone}</p>` : ""}
              ${agentGender ? `<p style="${styles.dataItem}"><span style="${styles.accentText}">Gender:</span> ${agentGender}</p>` : ""}
              ${agentAge ? `<p style="${styles.dataItem}"><span style="${styles.accentText}">Age:</span> ${agentAge}</p>` : ""}
            </div>

            <p style="${styles.p}">Log in to the admin portal to review their documents and verify.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/admin/agents" style="${styles.button}">Verify in Admin Portal</a>
            </div>
          </div>
          <div style="${styles.footer}">
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Agent Verification):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Agent Verification):", error);
    return { success: false, error };
  }
}

// 8. Send Agent Rejection Notification (From HELLO_EMAIL)
export async function sendAgentRejectionEmail({
  agentName,
  agentEmail,
  rejectionNote,
  resubmitUrl,
}: {
  agentName: string;
  agentEmail: string;
  rejectionNote: string;
  resubmitUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: [agentEmail],
      subject: "Action Required: Agent Verification Update - Budget Travel Packages",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Verification Update</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${agentName},</h2>
            <p style="${styles.p}">We have reviewed your agent verification request. Unfortunately, we cannot approve it at this time.</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.p}; margin-bottom: 8px;"><strong>Reason / Notes from Admin:</strong></p>
              <p style="${styles.p}; margin: 4px 0; color: #dc2626; font-weight: 500;">
                ${rejectionNote || "Please review your submitted documents and ensure all information is accurate and clear."}
              </p>
            </div>

            <p style="${styles.p}">Please click the button below to update your details and resubmit your verification request.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resubmitUrl}" style="${styles.button}">Resubmit Verification</a>
            </div>
            
            <p style="${styles.p}">This link will expire in 72 hours.</p>
            <p style="${styles.p}">Warm regards,<br/>The Budget Travel Team</p>
          </div>
          <div style="${styles.footer}">
             <p>If you have questions, reply to this email.</p>
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Agent Rejection):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Agent Rejection):", error);
    return { success: false, error };
  }
}

// 9. Send Agent Approval Notification (From HELLO_EMAIL)
export async function sendAgentApprovalEmail({
  agentName,
  agentEmail,
}: {
  agentName: string;
  agentEmail: string;
}) {
  try {
    // 1. Welcome Aboard email from NOREPLY
    const resAboard = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: [agentEmail],
      subject: "Welcome Aboard! Your Agent Account is Approved 🎉",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Account Verified</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${agentName},</h2>
            <p style="${styles.p}">Great news! We have successfully reviewed your documents and approved your agent verification request.</p>
            <p style="${styles.p}">Your account is now fully active. You can log into your admin dashboard to start managing your trips, leads, and clients.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/" style="${styles.button}">Access Dashboard</a>
            </div>
            <p style="${styles.p}">Warm regards,<br/>The Budget Travel Team</p>
          </div>
          <div style="${styles.footer}">
             <p>This is an automated message. Please do not reply.</p>
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (resAboard.error) {
      console.error("Resend Error (Welcome Aboard):", resAboard.error);
    }

    // 2. Personalized Welcome email from HELLO
    const resWelcome = await resend.emails.send({
      from: HELLO_EMAIL,
      to: [agentEmail],
      subject: "Welcome to the Team - Budget Travel Packages! 🌍",
      html: getAgentWelcomeEmailHtml(agentName),
    });

    if (resWelcome.error) {
      console.error("Resend Error (Agent Welcome):", resWelcome.error);
      return { success: false, error: resWelcome.error };
    }

    return { success: true, data: resWelcome.data };
  } catch (error) {
    console.error("Email Exception (Agent Approval):", error);
    return { success: false, error };
  }
}

// 10. Send Lead Assignment Email (From BOOKINGS_EMAIL)
export async function sendLeadAssignmentEmail({
  agentName,
  agentEmail,
  leadCount = 1,
  leadUrl,
}: {
  agentName: string;
  agentEmail: string;
  leadCount?: number;
  leadUrl: string;
}) {
  try {
    const isBulk = leadCount > 1;
    const title = isBulk ? "New Leads Assigned" : "New Lead Assigned";
    const subject = isBulk
      ? `You've been assigned ${leadCount} new leads! 🚀`
      : "You've been assigned a new lead! 🚀";

    const contentBox = isBulk
      ? `<p style="${styles.p}">You have been assigned <strong>${leadCount} new leads</strong>. Log in to your dashboard to review them and start reaching out.</p>`
      : `<p style="${styles.p}">A new lead has been assigned to you. Log in to your dashboard to view the lead's details and start the conversation.</p>`;

    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL,
      to: [agentEmail],
      subject,
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">${title}</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${agentName},</h2>
            ${contentBox}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${leadUrl}" style="${styles.button}">View Leads in Dashboard</a>
            </div>
            
            <p style="${styles.p}">Following up quickly increases the chance of securing a booking!</p>
            <p style="${styles.p}">Happy Selling,<br/>The Budget Travel Team</p>
          </div>
          <div style="${styles.footer}">
             <p>Budget Travel Agent Notification System</p>
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Lead Assignment):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Lead Assignment):", error);
    return { success: false, error };
  }
}
// 11. Send Payment Status Notification (Confirmed or Rejected)
export async function sendPaymentStatusNotification({
  to,
  name,
  amount,
  status,
  transactionId,
  type,
  destination,
  rejectionReason,
}: {
  to: string;
  name: string;
  amount: number;
  status: "verified" | "rejected";
  transactionId: string;
  type: "booking" | "trip_cost";
  destination: string;
  rejectionReason?: string;
}) {
  try {
    const isVerified = status === "verified";
    const paymentLabel = type === "booking" ? "Booking Amount" : "Trip Cost";
    
    const subject = isVerified 
      ? `Payment Confirmed: Trip to ${destination} ✅`
      : `Action Required: Payment Rejected for ${destination} ❌`;

    const html = `
      <div style="${styles.container}">
        <div style="${styles.header}">
          <h1 style="${styles.headerTitle}">${isVerified ? "Payment Confirmed" : "Payment Rejected"}</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="${styles.h2}">Hello ${name},</h2>
          <p style="${styles.p}">
            ${isVerified 
              ? `Great news! We have successfully verified your payment of <strong>₹${amount.toLocaleString("en-IN")}</strong> for your trip to <strong>${destination}</strong>.`
              : `We were unable to verify your payment of <strong>₹${amount.toLocaleString("en-IN")}</strong> for your trip to <strong>${destination}</strong>.`
            }
          </p>
          
          <div style="${styles.dataBox}">
            <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Type:</strong> ${paymentLabel}</p>
            <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Amount:</strong> ₹${amount.toLocaleString("en-IN")}</p>
            <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Transaction ID:</strong> ${transactionId}</p>
            <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Status:</strong> <span style="color: ${isVerified ? "#10b981" : "#ef4444"}; font-weight: 700; text-transform: uppercase;">${status}</span></p>
          </div>

          ${!isVerified && rejectionReason ? `
            <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <p style="color: #be123c; font-weight: 700; margin-bottom: 8px;">Reason for Rejection:</p>
              <p style="color: #be123c; margin: 0;">${rejectionReason}</p>
            </div>
            <p style="${styles.p}">Please log in to your dashboard to resubmit the payment with the correct transaction details.</p>
          ` : ""}

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard/bookings" style="${styles.button}">View Dashboard</a>
          </div>

          <p style="${styles.p}">If you have any questions, please reply to this email or contact your assigned agent.</p>
          <p style="${styles.p}">Best regards,<br/>The Budget Travel Team</p>
        </div>
        <div style="${styles.footer}">
           <p>This email was sent from <strong>booking@budgettravelpackages.in</strong></p>
           <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend Error (Payment Status):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Payment Status):", error);
    return { success: false, error };
  }
}

// 12. Send Final Document Upload Notification
export async function sendFinalDocumentEmail({
  name,
  email,
  destination,
  tripDates,
  dashboardUrl,
}: {
  name: string;
  email: string;
  destination: string;
  tripDates: string;
  dashboardUrl: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL,
      to: [email],
      subject: `Your Trip to ${destination} is Confirmed! ✈️ Here is your itinerary`,
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Trip Confirmed</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${name},</h2>
            <p style="${styles.p}">Great news! The final documents and itinerary for your trip to <strong>${destination}</strong> have been uploaded.</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Destination:</strong> ${destination}</p>
              <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Trip Dates:</strong> ${tripDates}</p>
            </div>

            <p style="${styles.p}">You can view, download, and print your complete itinerary PDF from your personal dashboard.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardUrl}" style="${styles.button}">View My Dashboard</a>
            </div>

            <p style="${styles.p}">If you have any last-minute questions, please reply to this email or contact your agent.</p>
            <p style="${styles.p}">Have a wonderful trip!<br/>The Budget Travel Team</p>
          </div>
          <div style="${styles.footer}">
             <p>This email was sent from <strong>booking@budgettravelpackages.in</strong></p>
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Final Document):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Final Document):", error);
    return { success: false, error };
  }
}

// 13. Send Payout Status Notification to Agent
export async function sendPayoutStatusEmail({
  agentName,
  agentEmail,
  amount,
  status,
  adminNote,
}: {
  agentName: string;
  agentEmail: string;
  amount: number;
  status: "Paid" | "decline";
  adminNote?: string;
}) {
  try {
    const isPaid = status === "Paid";
    const subject = isPaid
      ? `Payout Processed: ₹${amount.toLocaleString("en-IN")} ✅`
      : `Payout Request Declined: ₹${amount.toLocaleString("en-IN")} ❌`;

    const { data, error } = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: [agentEmail],
      subject,
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">${isPaid ? "Payout Processed" : "Payout Declined"}</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${agentName},</h2>
            <p style="${styles.p}">
              ${isPaid 
                ? `Your payout request for <strong>₹${amount.toLocaleString("en-IN")}</strong> has been successfully processed.`
                : `Your payout request for <strong>₹${amount.toLocaleString("en-IN")}</strong> has been declined.`
              }
            </p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Amount:</strong> ₹${amount.toLocaleString("en-IN")}</p>
              <p style="${styles.dataItem}"><strong style="width: 120px; display: inline-block;">Status:</strong> <span style="color: ${isPaid ? "#10b981" : "#ef4444"}; font-weight: 700; text-transform: uppercase;">${status}</span></p>
            </div>

            ${adminNote ? `
              <div style="background-color: ${isPaid ? '#f0fdf4' : '#fff1f2'}; border: 1px solid ${isPaid ? '#bbf7d0' : '#fecdd3'}; border-radius: 8px; padding: 16px; margin: 20px 0;">
                <p style="color: ${isPaid ? '#166534' : '#be123c'}; font-weight: 700; margin-bottom: 8px;">Admin Note:</p>
                <p style="color: ${isPaid ? '#166534' : '#be123c'}; margin: 0;">${adminNote}</p>
              </div>
            ` : ""}

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXTAUTH_URL}/admin/finance" style="${styles.button}">View Finance Dashboard</a>
            </div>

            <p style="${styles.p}">Best regards,<br/>The Budget Travel Team</p>
          </div>
          <div style="${styles.footer}">
             <p>This is an automated notification. Please do not reply.</p>
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Payout Status):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Payout Status):", error);
    return { success: false, error };
  }
}

// 12. Send Travel Document (PDF) Upload Notification
export async function sendTravelDocumentEmail({
  to,
  name,
  destination,
  pdfUrl,
}: {
  to: string;
  name: string;
  destination: string;
  pdfUrl: string;
}) {
  try {
    const html = `
      <div style="${styles.container}">
        <div style="${styles.header}">
          <h1 style="${styles.headerTitle}">Your Travel Documents</h1>
        </div>
        <div style="${styles.body}">
          <h2 style="${styles.h2}">Hello ${name},</h2>
          <p style="${styles.p}">Great news! Your official travel documents and tickets for your upcoming trip to <strong style="${styles.accentText}">${destination}</strong> have been finalized.</p>
          
          <div style="${styles.dataBox}">
            <p style="${styles.p}">You can download or view your comprehensive itinerary and necessary documents by clicking the link below:</p>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${pdfUrl}" target="_blank" rel="noopener noreferrer" style="${styles.button}">View Travel Documents (PDF)</a>
            </div>
          </div>

          <p style="${styles.p}">Please review the documents carefully. You can also always access them securely by logging into your Budget Travel Packages dashboard.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard/bookings" style="color: #666; text-decoration: underline; font-size: 14px;">Log in to your dashboard</a>
          </div>

          <p style="${styles.p}">Wishing you a wonderful trip ahead!</p>
          <p style="${styles.p}">Best regards,<br/>The Budget Travel Team</p>
        </div>
        <div style="${styles.footer}">
           <p>This email was sent from <strong>booking@budgettravelpackages.in</strong></p>
           <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL,
      to: [to],
      subject: `Your Travel Documents for ${destination} ✈️`,
      html,
    });

    if (error) {
      console.error("Resend Error (Travel Documents):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Travel Documents):", error);
    return { success: false, error };
  }
}

