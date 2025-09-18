import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { sendMail } from "../utils/mailer.js";

export const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply" });
    }

    // inside applyToJob controller
    if (!req.user.resume) {
      return res.status(400).json({
        message: "You must upload a resume before applying to a job.",
      });
    }

    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.user.resume,
    });

    // ✅ Email to applicant
    await sendMail({
      to: req.user.email,
      subject: "Application Submitted",
      text: `You applied for Job ID: ${req.params.jobId}`,
      html: `<h2>Application Submitted</h2>
             <p>You applied for Job ID: <b>${req.params.jobId}</b></p>`,
    });

    // ✅ Email to employer
    const job = await Job.findById(req.params.jobId).populate(
      "company",
      "name email"
    );
    if (job?.company?.email) {
      await sendMail({
        to: job.company.email,
        subject: `New Application for ${job.title}`,
        text: `Hi ${job.company.name}, you have a new applicant for your job "${job.title}".`,
        html: `<h2>New Application Received</h2>
               <p>Hi <b>${job.company.name}</b>,</p>
               <p>A new applicant has applied for your job <b>${job.title}</b>.</p>`,
      });
    }

    res.status(201).json(application);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate("job", "title company location type")
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getApplicantsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job || job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view applicatons" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("job", "title location category type")
      .populate("applicant", "name email avatar resume");

    res.json(applications);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("job", "title")
      .populate("applicant", "name email avatar resume");

    if (!app)
      return res
        .status(404)
        .json({ message: "Application not found.", id: req.params.id });

    const isOwner =
      app.applicant._id.toString() === req.user._id.toString() ||
      app.job.company.toString() === req.user._id.toString();

    if (!isOwner) {
      return es
        .status(403)
        .json({ message: "Not authorized to view this application" });
    }

    res.json(app);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant", "email name");

    if (!app || app.job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }

    app.status = status;
    await app.save();

    // ✅ Send email to applicant
    await sendMail({
      to: app.applicant.email,
      subject: "Application Status Updated",
      text: `Hi ${app.applicant.name}, your application status for "${app.job.title}" is now: ${status}`,
      html: `<h2>Status Update</h2><p>Hi ${app.applicant.name},<br>Your application for <b>${app.job.title}</b> is now: <b>${status}</b></p>`,
    });

    res.json({ message: "Application status updated & email sent", status });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
