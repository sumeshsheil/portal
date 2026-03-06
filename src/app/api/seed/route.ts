import { faker } from "@faker-js/faker";
import { connectDB } from "@/lib/db/mongoose";
import Lead from "@/lib/db/models/Lead";
import User from "@/lib/db/models/User";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

const USERS = [
  {
    name: "Rahul Sharma",
    email: "agent.rahul@example.com",
    role: "agent",
    status: "active",
    phone: "+91 9876543210",
  },
  {
    name: "Priya Patel",
    email: "agent.priya@example.com",
    role: "agent",
    status: "active",
    phone: "+91 9876543211",
  },
  {
    name: "Amit Singh",
    email: "agent.amit@example.com",
    role: "agent",
    status: "inactive",
    phone: "+91 9876543212",
  },
];

const LEAD_STAGES = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
  "abandoned",
] as const;

const DESTINATIONS = [
  "Bali, Indonesia",
  "Paris, France",
  "Dubai, UAE",
  "Maldives",
  "Shimla, India",
  "Goa, India",
  "Tokyo, Japan",
  "Swiss Alps",
  "Kerala, India",
  "Bangkok, Thailand",
];

async function seed() {
  await connectDB();

  // 0. Create Admin if it doesn't exist
  const adminEmail = process.env.ADMIN_EMAIL || "sm.sanny1235@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";
  const adminName = process.env.ADMIN_NAME || "Sazzad";

  let adminUser = await User.findOne({ email: adminEmail.toLowerCase() });
  if (!adminUser) {
    const hashedAdminPassword = await bcryptjs.hash(adminPassword, 10);
    await User.create({
      email: adminEmail.toLowerCase(),
      name: adminName,
      password: hashedAdminPassword,
      role: "admin",
      status: "active",
      mustChangePassword: false,
      isActivated: true,
      isVerified: true,
    });
    console.log(`Created admin user: ${adminEmail}`);
  }

  // 1. Create Agents if they don't exist
  const agents = [];

  for (const userData of USERS) {
    let user = await User.findOne({ email: userData.email });
    if (!user) {
      const hashedPassword = await bcryptjs.hash("password123", 10);
      user = await User.create({
        ...userData,
        password: hashedPassword,
        mustChangePassword: true,
      });
    }
    if (user.role === "agent" && user.status === "active") {
      agents.push(user);
    }
  }

  // 2. Create Leads
  const leadsToCreate = 50;

  for (let i = 0; i < leadsToCreate; i++) {
    const isInternational = faker.datatype.boolean();
    const guests = faker.number.int({ min: 1, max: 6 });
    const stage = faker.helpers.arrayElement(LEAD_STAGES);

    const assignedAgent =
      stage === "new" && faker.number.float({ min: 0, max: 1 }) > 0.3
        ? null
        : faker.helpers.arrayElement(agents);

    const daysAgo = faker.number.int({ min: 0, max: 60 });
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const lastActivity = new Date(createdAt);
    lastActivity.setDate(
      lastActivity.getDate() + faker.number.int({ min: 0, max: daysAgo }),
    );

    const lead = {
      tripType: isInternational ? "international" : "domestic",
      departureCity: faker.location.city(),
      destination: faker.helpers.arrayElement(DESTINATIONS),
      travelDate: faker.date.future().toLocaleDateString("en-GB"),
      duration: `${faker.number.int({ min: 3, max: 14 })} Days`,
      guests: guests,
      budget: faker.number.int({ min: 1000, max: 20000 }),
      specialRequests:
        faker.number.float({ min: 0, max: 1 }) > 0.7
          ? faker.lorem.sentence()
          : "",
      travelers: [
        {
          name: faker.person.fullName(),
          age: faker.number.int({ min: 20, max: 60 }),
          gender: faker.helpers.arrayElement(["male", "female", "other"]),
          email: faker.internet.email(),
          phone: faker.phone.number(),
        },
      ],
      source: faker.helpers.arrayElement([
        "website",
        "social_media",
        "referral",
        "phone",
      ]),
      stage: stage,
      notes:
        faker.number.float({ min: 0, max: 1 }) > 0.5
          ? faker.lorem.paragraph()
          : "",
      agentId: assignedAgent?._id,
      createdAt: createdAt,
      lastActivityAt: lastActivity,
      updatedAt: lastActivity,
    };

    await Lead.create(lead);
  }

  const count = await Lead.countDocuments();
  return count;
}

export async function GET(request: Request) {
  // Block in production
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { success: false, error: "Seed route is disabled in production" },
      { status: 403 },
    );
  }

  // Require secret in all environments
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const count = await seed();
    return NextResponse.json({
      success: true,
      message: `Database seeded successfully. Total leads: ${count}`,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Seeding error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
