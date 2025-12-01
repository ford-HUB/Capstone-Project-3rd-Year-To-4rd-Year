import { Op } from 'sequelize';
import { db } from '../config/db.js';
import Accounts from "./Accounts.model.js"
import CampusUsers from "./Campus/CampusUsers.model.js"
import Department from "./Department.model.js"
import Course from "./Campus/Course.model.js"
import YearLevel from "./Campus/YearLevel.model.js"
import Role from "./Role.model.js"
import VerificationCodes from "./Campus/VerificationCode.model.js"
import Staff from "./management/Staff.model.js"
import RequestApproval from "./management/RequestApproval.model.js"
import ApprovalToken from "./management/ApprovalToken.model.js"
import AuditLog from "./director/AuditLog.model.js"
import Event from "./event/Event.model.js"
import Category from "./event/Category.model.js"
import EventCategory from "./event/EventCategory.model.js"
import Organizer from "./event/Organizer.model.js"
import EventDepartment from "./event/EventDepartment.model.js"
import EventRegistration from "./event/EventRegistration.model.js"
import Volunteer from "./Volunteer.model.js"
import EventQRCode from "./event/EventQRCode.model.js"
import Attendance from "./event/Attendance.model.js"
import Donor from "./donor/Donor.model.js"
import Director from "./director/Director.modal.js"
import PaymentInfo from "./director/PaymentInfo.model.js"
import Coordinator from "./management/Coordinator.model.js"
import Certificate_Template from "./event/Certificate_Template.model.js"
import Certificate from "./event/Certificate.model.js"
import Notification from "./Notification.model.js"
import Document from "./Document.model.js"
import MatchedEvent from "./match/MatchedEvent.model.js"
import AccountUpdateLog from "./AccountUpdateLog.model.js"
import EventEvaluation from "./Feedback/EventEvaluation.model.js"
import BeneficiaryEventEvaluation from "./Feedback/BeneficiaryEventEvaluation.model.js"
import Form from "./form/Form.model.js"
import FormResponse from "./form/FormResponse.model.js"
import FlexibleResponse from "./form/FlexibleResponse.model.js"
import Requirement from "./requirements/Requirement.model.js"
import RequirementVisibility from "./requirements/RequirementVisibility.model.js"
import Submission from "./submission/Submission.model.js"
import Beneficiary from "./benefitciary/Beneficiary.model.js"
import FormLink from './form/v2/FormLink.model.js';
import Response from './form/v2/Response.model.js';
import StrandCourse from './Campus/StrandCourse.model.js';
import DocumentRequestApproval from './director/DocumentRequestApproval.model.js';
import ResetPassword from './ResetPassword.model.js';
import Donations from './donations/Donations.model.js';
import PaymentMethod from './donations/PaymentMethod.model.js';
import GoodsDonation from './donations/GoodsDonation.model.js';
import Payments from './donations/Payments.model.js';
import EventGoodsType from './donations/EventGoodsType.model.js';
import LinkedPaymentAccounts from './LinkedPaymentAccounts.model.js';
import Testimonials from './testimonial/Testimonials.model.js';
import ActivityLog from './ActivityLog.model.js';
import GraduatedYear from './Campus/GraduatedYear.model.js';



Accounts.hasOne(Role, { foreignKey: "account_id", onDelete: "CASCADE" });
Role.belongsTo(Accounts, { foreignKey: "account_id" });

Accounts.hasOne(CampusUsers, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true });
CampusUsers.belongsTo(Accounts, { foreignKey: 'account_id' });

Accounts.hasOne(Staff, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true });
Staff.belongsTo(Accounts, { foreignKey: 'account_id' });

Accounts.hasOne(Coordinator, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })
Coordinator.belongsTo(Accounts, { foreignKey: 'account_id' })

Accounts.hasOne(Beneficiary, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })
Beneficiary.belongsTo(Accounts, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })

Accounts.hasOne(Donor, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })
Donor.belongsTo(Accounts, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })

Accounts.hasOne(Director, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })
Director.belongsTo(Accounts, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })

Accounts.hasMany(LinkedPaymentAccounts, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })
LinkedPaymentAccounts.belongsTo(Accounts, { foreignKey: 'account_id' })

Accounts.hasMany(PaymentMethod, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })
PaymentMethod.belongsTo(Accounts, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })

Department.hasMany(CampusUsers, { foreignKey: 'department_id', onDelete: "CASCADE", hooks: true });
CampusUsers.belongsTo(Department, { foreignKey: 'department_id', onDelete: "CASCADE", hooks: true });

Course.hasMany(CampusUsers, { foreignKey: "course_id", onDelete: "CASCADE", hooks: true });
CampusUsers.belongsTo(Course, { foreignKey: "course_id", onDelete: "CASCADE", hooks: true });

StrandCourse.hasMany(CampusUsers, { foreignKey: 'strand_course_id', onDelete: "CASCADE", hooks: true })
CampusUsers.belongsTo(StrandCourse, { foreignKey: 'strand_course_id', onDelete: "CASCADE", hooks: true })

YearLevel.hasMany(CampusUsers, { foreignKey: "yl_id", onDelete: "CASCADE", hooks: true });
CampusUsers.belongsTo(YearLevel, { foreignKey: "yl_id" });

CampusUsers.hasOne(VerificationCodes, { foreignKey: 'account_id', onDelete: 'CASCADE', hooks:true })
VerificationCodes.belongsTo(CampusUsers, { foreignKey: 'account_id' })

Accounts.hasOne(VerificationCodes, { foreignKey: 'account_id', onDelete: 'CASCADE', hooks: true })
VerificationCodes.belongsTo(Accounts, { foreignKey: 'account_id' })

Department.hasMany(Coordinator, { foreignKey: 'department_id', onDelete: "CASCADE", hooks: true })
Coordinator.belongsTo(Department, { foreignKey: 'department_id' })

RequestApproval.hasOne(ApprovalToken, { foreignKey: 'ra_id', onDelete: "CASCADE", hooks: true })
ApprovalToken.belongsTo(RequestApproval, { foreignKey: 'ra_id', onDelete: "CASCADE", hooks: true })

AuditLog.belongsTo(Accounts, { through: Accounts, foreignKey: 'account_id', onDelete: "CASCADE", hooks: true }),
Accounts.belongsToMany(AuditLog,  { through: AuditLog, foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })

Event.hasOne(FormLink, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
FormLink.belongsTo(Event, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })

Accounts.hasMany(FormLink, { foreignKey: 'created_by', onDelete: "CASCADE", hooks: true })
FormLink.belongsTo(Accounts, { foreignKey: 'created_by', onDelete: "CASCADE", hooks: true })

FormLink.hasMany(Response, { foreignKey: 'formlink_id', onDelete: "CASCADE", hooks: true })
Response.belongsTo(FormLink, { foreignKey: 'formlink_id', onDelete: "CASCADE", hooks: true })
 
Event.belongsToMany(Category,{ through: EventCategory, foreignKey: 'event_id', otherKey: 'category_id', onDelete: "CASCADE", hooks: true })
Category.belongsToMany(Event, { through: EventCategory, foreignKey: 'category_id', otherKey: 'event_id', onDelete: "CASCADE", hooks: true})

Event.belongsTo(Organizer, { foreignKey: 'organizer_id', onDelete: "CASCADE", hooks: true })
Organizer.hasMany(Event, { foreignKey: 'organizer_id', onDelete: "CASCADE", hooks: true })

Event.belongsToMany(Department, { through: EventDepartment, foreignKey: 'event_id', otherKey: 'department_id', onDelete: "CASCADE", hooks: true })
Department.belongsToMany(Event, { through: EventDepartment, foreignKey: 'department_id', otherKey: 'event_id', onDelete: "CASCADE", hooks: true })

Event.hasMany(EventQRCode, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
EventQRCode.belongsTo(Event, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })

EventRegistration.belongsTo(Event, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
Event.hasMany(EventRegistration, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })

Certificate_Template.hasMany(Certificate, { foreignKey: 'ct_id', onDelete: "CASCADE", hooks: true } )
Category.hasOne(Certificate_Template, { foreignKey: 'category_id', onDelete: "CASCADE", hooks: true })
Certificate_Template.belongsTo(Category, { foreignKey: 'category_id' })
Certificate.belongsTo(Certificate_Template, { foreignKey: 'ct_id' })

Event.hasMany(Certificate, { foreignKey: 'event_id', onDelete: "CASCADE" });
Certificate.belongsTo(Event, { foreignKey: 'event_id', onDelete: "CASCADE" });

Volunteer.hasMany(Certificate, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Certificate.belongsTo(Volunteer, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true } )
Director.hasMany(Certificate, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Certificate.belongsTo(Director, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true } )
Staff.hasMany(Certificate, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Certificate.belongsTo(Staff, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true } )
Coordinator.hasMany(Certificate, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Certificate.belongsTo(Coordinator, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true } )

Accounts.hasMany(AccountUpdateLog, { foreignKey: 'account_id', constraints: false, onDelete: "CASCADE" })
AccountUpdateLog.belongsTo(Accounts, { foreignKey: 'account_id', constraints: false, onDelete: "CASCADE" })

Volunteer.hasMany(Attendance, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Attendance.belongsTo(Volunteer, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Event.hasMany(Attendance, { foreignKey: 'event_id', constraints: false, onDelete: "CASCADE", hooks: true })
Attendance.belongsTo(Event, { foreignKey: 'event_id', constraints: false, onDelete: "CASCADE", hooks: true })
Director.hasMany(Attendance, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Attendance.belongsTo(Director, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Staff.hasMany(Attendance, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Attendance.belongsTo(Staff, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Coordinator.hasMany(Attendance, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Attendance.belongsTo(Coordinator, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Beneficiary.hasMany(Attendance, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
Attendance.belongsTo(Beneficiary, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

CampusUsers.hasOne(Volunteer, { foreignKey: 'campus_user_id', onDelete: "CASCADE", hooks: true })
Volunteer.belongsTo(CampusUsers, { foreignKey: 'campus_user_id', onDelete: "CASCADE", hooks: true })

Volunteer.belongsTo(Department, { foreignKey: 'department_id', onDelete: "CASCADE", hooks: true })
Volunteer.belongsTo(Course, { foreignKey: 'course_id', onDelete: "CASCADE", hooks: true })
Volunteer.belongsTo(YearLevel, { foreignKey: 'yl_id', onDelete: "CASCADE", hooks: true })
Volunteer.belongsTo(StrandCourse, { foreignKey: 'strand_course_id', onDelete: "CASCADE", hooks: true })

StrandCourse.hasMany(Volunteer, { foreignKey: 'strand_course_id', onDelete: "CASCADE", hooks: true })

Volunteer.hasMany(MatchedEvent, { foreignKey: 'volunteer_id', onDelete: "CASCADE", hooks: true })
MatchedEvent.belongsTo(Volunteer, { foreignKey: 'volunteer_id', onDelete: "CASCADE", hooks: true })

Beneficiary.hasMany(MatchedEvent, { foreignKey: 'beneficiary_id', onDelete: "CASCADE", hooks: true })
MatchedEvent.belongsTo(Beneficiary, { foreignKey: 'beneficiary_id', onDelete: "CASCADE", hooks: true })

Accounts.hasMany(Document, { foreignKey: 'author_id', constraints: false, onDelete: "CASCADE", hooks: true })
Document.belongsTo(Accounts, { foreignKey: 'author_id', constraints: false, onDelete: "CASCADE", hooks: true })

Volunteer.hasMany(Notification, { foreignKey: 'sender_id', onDelete: "CASCADE", hooks: true })
Notification.belongsTo(Volunteer, { foreignKey: 'sender_id', constraints: false, onDelete: "CASCADE", hooks: true })

Director.hasMany(Notification, { foreignKey: 'sender_id', onDelete: "CASCADE", hooks: true })
Notification.belongsTo(Director, { foreignKey: 'sender_id', constraints: false, onDelete: "CASCADE", hooks: true })

Staff.hasMany(Notification, { foreignKey: 'sender_id', onDelete: "CASCADE", hooks: true })
Notification.belongsTo(Staff, { foreignKey: 'sender_id', constraints: false, onDelete: "CASCADE", hooks: true })

Coordinator.hasMany(Notification, { foreignKey: 'sender_id', onDelete: "CASCADE", hooks: true })
Notification.belongsTo(Coordinator, { foreignKey: 'sender_id', constraints: false, onDelete: "CASCADE", hooks: true })

Volunteer.hasMany(EventRegistration, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
EventRegistration.belongsTo(Volunteer, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

Staff.hasMany(EventRegistration, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
EventRegistration.belongsTo(Staff, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

Coordinator.hasMany(EventRegistration, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
EventRegistration.belongsTo(Coordinator, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

Director.hasMany(EventRegistration, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
EventRegistration.belongsTo(Director, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

Beneficiary.hasMany(EventRegistration, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
EventRegistration.belongsTo(Beneficiary, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

Attendance.belongsTo(EventRegistration, { foreignKey: 'event_id', targetKey: 'event_id', constraints: false })
EventRegistration.hasMany(Attendance, {  foreignKey: 'event_id', sourceKey: 'event_id', constraints: false })


Volunteer.hasMany(EventEvaluation, { foreignKey: 'volunteer_id', onDelete: "CASCADE", hooks: true })
EventEvaluation.belongsTo(Volunteer, { foreignKey:'volunteer_id', onDelete: "CASCADE", hooks: true })

Event.hasMany(EventEvaluation, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
EventEvaluation.belongsTo(Event, { foreignKey:'event_id', onDelete: "CASCADE", hooks: true })

Event.hasMany(BeneficiaryEventEvaluation, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
BeneficiaryEventEvaluation.belongsTo(Event, { foreignKey:'event_id', onDelete: "CASCADE", hooks: true })

Beneficiary.hasMany(BeneficiaryEventEvaluation, { foreignKey: 'beneficiary_id', onDelete: "CASCADE", hooks: true })
BeneficiaryEventEvaluation.belongsTo(Beneficiary, { foreignKey:'beneficiary_id', onDelete: "CASCADE", hooks: true })

// Form relationships
Accounts.hasMany(Form, { foreignKey: 'created_by', onDelete: "CASCADE", hooks: true })
Form.belongsTo(Accounts, { foreignKey: 'created_by', onDelete: "CASCADE", hooks: true })

Category.hasMany(Form, { foreignKey: 'category_id', onDelete: "CASCADE", hooks: true })
Form.belongsTo(Category, { foreignKey: 'category_id', onDelete: "CASCADE", hooks: true })

Event.hasMany(Form, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
Form.belongsTo(Event, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })

Form.hasMany(FormResponse, { foreignKey: 'form_id', onDelete: "CASCADE", hooks: true })
FormResponse.belongsTo(Form, { foreignKey: 'form_id', onDelete: "CASCADE", hooks: true })

Accounts.hasMany(FormResponse, { foreignKey: 'respondent_id', onDelete: "CASCADE", hooks: true })
FormResponse.belongsTo(Accounts, { foreignKey: 'respondent_id', onDelete: "CASCADE", hooks: true })

// FlexibleResponse relationships (polymorphic - following existing pattern)
Form.hasMany(FlexibleResponse, { foreignKey: 'form_id', constraints: false, onDelete: "CASCADE", hooks: true })
FlexibleResponse.belongsTo(Form, { foreignKey: 'form_id', constraints: false, onDelete: "CASCADE", hooks: true })

Event.hasMany(FlexibleResponse, { foreignKey: 'event_id', constraints: false, onDelete: "CASCADE", hooks: true })
FlexibleResponse.belongsTo(Event, { foreignKey: 'event_id', constraints: false, onDelete: "CASCADE", hooks: true })

// Polymorphic participant relationships (like Attendance and EventRegistration)
Volunteer.hasMany(FlexibleResponse, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
FlexibleResponse.belongsTo(Volunteer, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

Beneficiary.hasMany(FlexibleResponse, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
FlexibleResponse.belongsTo(Beneficiary, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

Staff.hasMany(FlexibleResponse, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
FlexibleResponse.belongsTo(Staff, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

Coordinator.hasMany(FlexibleResponse, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
FlexibleResponse.belongsTo(Coordinator, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

Director.hasMany(FlexibleResponse, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })
FlexibleResponse.belongsTo(Director, { foreignKey: 'participant_id', constraints: false, onDelete: "CASCADE", hooks: true })

// Requirement associations
Requirement.belongsTo(Director, { foreignKey: 'created_by', onDelete: "CASCADE", hooks: true });
Director.hasMany(Requirement, { foreignKey: 'created_by', onDelete: "CASCADE", hooks: true });

Requirement.hasMany(RequirementVisibility, { foreignKey: 'requirement_id', onDelete: "CASCADE", hooks: true });
RequirementVisibility.belongsTo(Requirement, { foreignKey: 'requirement_id', onDelete: "CASCADE", hooks: true });

// Submission associations
Department.hasMany(Submission, { foreignKey: 'department_id', onDelete: "CASCADE", hooks: true });
Submission.belongsTo(Department, { foreignKey: 'department_id', onDelete: "CASCADE", hooks: true });

Accounts.hasMany(Submission, { foreignKey: 'submitted_by', onDelete: "CASCADE", hooks: true });
Submission.belongsTo(Accounts, { foreignKey: 'submitted_by', onDelete: "CASCADE", hooks: true });

// Document Request Approval associations
Document.hasMany(DocumentRequestApproval, { foreignKey: 'document_id', onDelete: "CASCADE", hooks: true });
DocumentRequestApproval.belongsTo(Document, { foreignKey: 'document_id', onDelete: "CASCADE", hooks: true });

Accounts.hasMany(DocumentRequestApproval, { foreignKey: 'requested_by', onDelete: "CASCADE", hooks: true });
DocumentRequestApproval.belongsTo(Accounts, { foreignKey: 'requested_by', onDelete: "CASCADE", hooks: true });

Accounts.hasMany(DocumentRequestApproval, { foreignKey: 'reviewed_by', onDelete: "CASCADE", hooks: true });
DocumentRequestApproval.belongsTo(Accounts, { foreignKey: 'reviewed_by', onDelete: "CASCADE", hooks: true });

Accounts.hasMany(ResetPassword, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true });
ResetPassword.belongsTo(Accounts, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true });


Donations.hasOne(GoodsDonation, { foreignKey: 'donation_id', onDelete: "CASCADE", hooks: true })
GoodsDonation.belongsTo(Donations, { foreignKey: 'donation_id', onDelete: "CASCADE", hooks: true })

Donations.hasMany(PaymentMethod, { foreignKey: 'donation_id', onDelete: "CASCADE", hooks: true })
PaymentMethod.belongsTo(Donations, { foreignKey: 'donation_id', onDelete: "CASCADE", hooks: true })

Donations.hasMany(Payments, { foreignKey: 'donation_id', onDelete: "CASCADE", hooks: true })
Payments.belongsTo(Donations, { foreignKey: 'donation_id', onDelete: "CASCADE", hooks: true })

PaymentMethod.hasMany(Payments, { foreignKey: 'payment_method_id', onDelete: "CASCADE", hooks: true })
Payments.belongsTo(PaymentMethod, { foreignKey: 'payment_method_id', onDelete: "CASCADE", hooks: true })

Donor.hasOne(Donations, { foreignKey: 'donor_id', onDelete: "CASCADE", hooks: true })
Donations.belongsTo(Donor, { foreignKey: 'donor_id', onDelete: "CASCADE", hooks: true })

Event.hasMany(Donations, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
Event.hasMany(EventGoodsType, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })

EventGoodsType.belongsTo(Event, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })
Donations.belongsTo(Event, { foreignKey: 'event_id', onDelete: "CASCADE", hooks: true })

Accounts.hasMany(Donations, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })
Donations.belongsTo(Accounts, { foreignKey: 'account_id', onDelete: "CASCADE", hooks: true })

Beneficiary.hasMany(Testimonials, { foreignKey: 'sender_id', onDelete: "CASCADE", hooks: true })
Testimonials.belongsTo(Beneficiary, { foreignKey: 'sender_id', constraints: false, onDelete: "CASCADE", hooks: true })

Director.hasMany(ActivityLog, { foreignKey: 'user_id', onDelete: "CASCADE", hooks: true })
ActivityLog.belongsTo(Director, { foreignKey: 'user_id', constraints: false, onDelete : "CASCADE", hooks: true })

Staff.hasMany(ActivityLog, { foreignKey: 'user_id', onDelete: "CASCADE", hooks: true })
ActivityLog.belongsTo(Staff, { foreignKey: 'user_id', constraints: false, onDelete : "CASCADE", hooks: true })

Coordinator.hasMany(ActivityLog, { foreignKey: 'user_id', onDelete: "CASCADE", hooks: true })
ActivityLog.belongsTo(Coordinator, { foreignKey: 'user_id', constraints: false, onDelete : "CASCADE", hooks: true })

Volunteer.hasMany(ActivityLog, { foreignKey: 'user_id', onDelete: "CASCADE", hooks: true })
ActivityLog.belongsTo(Volunteer, { foreignKey: 'user_id', constraints: false, onDelete : "CASCADE", hooks: true })

Beneficiary.hasMany(ActivityLog, { foreignKey: 'user_id', onDelete: "CASCADE", hooks: true })
ActivityLog.belongsTo(Beneficiary, { foreignKey: 'user_id', constraints: false, onDelete : "CASCADE", hooks: true })

Donor.hasMany(ActivityLog, { foreignKey: 'user_id', onDelete: "CASCADE", hooks: true })
ActivityLog.belongsTo(Donor, { foreignKey: 'user_id', constraints: false, onDelete : "CASCADE", hooks: true })

CampusUsers.belongsTo(GraduatedYear, { foreignKey: 'gy_id', onDelete: "SET NULL", hooks: true })
GraduatedYear.hasMany(CampusUsers, { foreignKey: 'gy_id', onDelete: "SET NULL", hooks: true })


const models = {
    sequelize: db,
    Director,
    Donor,
    Notification,
    Document,
    Coordinator,
    EventRegistration,
    Certificate_Template,
    Certificate,
    Volunteer,
    GraduatedYear,
    Attendance,
    AccountUpdateLog,
    ActivityLog,
    EventQRCode,
    EventEvaluation,
    MatchedEvent,
    EventRegistration,
    EventDepartment,
    Event,
    Category,
    EventCategory,
    Organizer,
    AuditLog,
    RequestApproval,
    Beneficiary,
    ApprovalToken,
    CampusUsers,
    StrandCourse,
    Accounts,
    Staff,
    Department,
    Course,
    YearLevel,
    Role,
    VerificationCodes,
    BeneficiaryEventEvaluation,
    Form,
    FormResponse,
    FlexibleResponse,
    Requirement,
    RequirementVisibility,
    Submission,
    FormLink,
    Response,
    DocumentRequestApproval,
    ResetPassword,
    Donations,
    GoodsDonation,
    Payments,
    EventGoodsType,
    LinkedPaymentAccounts,
    PaymentMethod,
    Testimonials
}

export default models 