import { Search, Users, FileText, MessageSquare, BarChart3, Shield, Clock, Award, Briefcase, Building2, LayoutDashboard, Plus } from "lucide-react";

export const jobSeekerFeatures = [
    {
        icon: Search,
        title: "Smart Job Matching",
        description: "AI-powered algorithm matches you with relevant opportunities based on your skills and preferences.",
    },
    {
        icon: FileText,
        title: "Resume Builder",
        description: "Create Professional resumes with our intuitive builder and template designed by experts.",
    },
    {
        icon: MessageSquare,
        title: "Direct Communication",
        description: "Connect directly with hiring managers and recruiters through our secure messaging platform.",
    },
    {
        icon: Award,
        title: "Skill Assessment",
        description: "Showcase your abilities with verified skill tests and earn badges that employers trust.",
    },
];

export const employerFeatures = [
    {
        icon: Users,
        title: "Talent pool Access",
        description: "Access our vast databaseof pre-screened candidates and find the perfect fit for your team.",
    },
    {
        icon: BarChart3,
        title: "Analytics Dashboard",
        description: "Track your hiring performance with detailed analytics and insights on candidate engagement.",
    },
    {
        icon: Shield,
        title: "Verified Candidates",
        description: "All candidates undergo background verification to ensure you're hiring trustworthy professionals.",
    },
    {
        icon: Clock,
        title: "Quick Hiring",
        description: "Streamlined hiring process reduces time-to-hire by 60% with automated screen tools.",
    },
];

export const NAVIGATION_MENU = [
    { id: "employer-dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "post-job", name: "Post Job", icon: Plus },
    { id: "manage-jobs", name: "Manage Jobs", icon: Briefcase },
    { id: "company-profile", name: "Company Profile", icon: Building2 },
];

//Categories
export const CATEGORIES = [
    { value: "Engineering", label: "Engineering" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Sales", label: "Sales" },
    { value: "IT & Software", label: "IT & Software" },
    { value: "Customer-service", label: "Customer Service" },
    { value: "Product", label: "Product" },
    { value: "Operations", label: "Operations" },
    { value: "Finance", label: "Finance" },
    { value: "HR", label: "HR" },
    { value: "Other", label: "Other" },
];

export const JOB_TYPES = [
    { value: "Remote", label: "Remote" },
    { value: "Full-Time", label: "Full-Time" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
];

export const SALARY_RANGES = [
    "Less than 20000",
    "20000 - 50000",
    "More than 50000",
];