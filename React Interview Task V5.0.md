**Experience:** 0–6 Months (Industry / Internship / Personal Projects)

## **Objective**

Develop a **Visitor Pass Management System** using the MERN Stack (MongoDB, Express.js, React.js, and Node.js).

The objective of this assessment is to evaluate your understanding of application architecture, business logic implementation, authentication, role-based access control, code quality, and problem-solving skills.

---

# **Technology Stack**

The application must be developed using:

* React.js  
* Node.js  
* Express.js  
* MongoDB

You are free to use any suitable libraries or packages where appropriate.

---

# **Functional Requirements**

## **1\. Authentication**

Implement a secure login system.

After successful login:

* Display navigation based on the logged-in user's role.  
* Prevent unauthorized access to pages.  
* Protect backend APIs based on user permissions.

---

## **2\. User Roles**

The application should support the following roles:

### **Administrator**

* View overall dashboard  
* Manage Employees  
* Manage User Accounts  
* View Visitor Reports  
* View Activity History

---

### **Receptionist**

* Register Visitors  
* Check In Visitors  
* Check Out Visitors  
* View Visitor History

---

### **Employee**

* View Visitor Requests  
* Approve Visitor Requests  
* Reject Visitor Requests  
* Add Remarks

---

## **3\. Dashboard**

Each role should have an appropriate dashboard displaying relevant information.

Examples include:

* Pending Requests  
* Today's Visitors  
* Visitors Currently Inside  
* Total Employees  
* Scheduled Visitors

The dashboard contents should be meaningful for the logged-in role.

---

## **4\. Visitor Registration**

Receptionist should be able to register visitors.

The registration should include appropriate visitor details, employee to visit, visit schedule, and purpose of visit.

Once submitted, the request should be available for employee approval.

---

# **Business Rules**

The following business rules must be implemented.

### **Rule 1**

A visitor cannot have more than one active visit at the same time.

---

### **Rule 2**

Duplicate visitor registrations for the same visitor on the same date should not be allowed.

---

### **Rule 3**

Visit date cannot be earlier than the current date.

---

### **Rule 4**

For today's registrations, expected arrival time cannot be earlier than the current time.

---

### **Rule 5**

An employee cannot have more than three pending visitor requests awaiting approval.

---

### **Rule 6**

Visitors can only be checked in after approval.

---

### **Rule 7**

A visitor who is already checked in cannot be checked in again until checked out.

---

### **Rule 8**

Check-out time must always be later than check-in time.

---

### **Rule 9**

Rejected visitor requests cannot be checked in.

---

### **Rule 10**

Cancelled visits should not appear in active visitor lists.

---

# **Visitor Workflow**

The application should support the following workflow.

Receptionist creates visitor request

↓

Employee reviews request

↓

Employee approves or rejects

↓

Receptionist checks in approved visitor

↓

Receptionist checks out visitor

↓

Visitor history maintained

---

# **Search**

Provide search and filtering for visitor records using appropriate combinations such as:

* Visitor Name  
* Employee Name  
* Visit Date  
* Status

---

# **Reports**

Provide summary reports with suitable filters.

Example:

* Today  
* This Week  
* Custom Date Range

Reports should provide meaningful visitor statistics.

---

# **Activity History**

Maintain activity history for every visitor request.

Examples include:

* Created  
* Approved  
* Rejected  
* Checked In  
* Checked Out  
* Cancelled

Each activity should record:

* Action performed  
* Date & Time  
* User who performed the action

---

# **General Requirements**

The application should demonstrate:

* Professional UI design  
* Proper project structure  
* Reusable components  
* Input validation  
* Error handling  
* Responsive user interface  
* Clean and maintainable code  
* Proper separation of frontend and backend responsibilities

---

**Timeline:** 

The completed task must be submitted within **2 calendar days** from the date the assignment is shared with you. 

# **Submission**

Submit the following:

* The complete project should be submitted as a GitHub repository & Vercel or Netlify App to 98405 99789 through whatsapp with **your name & phone number**.  
* README with setup instructions  
* Environment configuration details  
* Brief API documentation

