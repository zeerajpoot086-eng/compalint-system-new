import bcrypt from 'bcryptjs';
import { IUser, IComplaint, ITechnician, INotification } from '../models/types.js';

// In-Memory & Persistent Demo Database Storage Engine
// Ready for direct MongoDB Mongoose connection when MONGO_URI is set
class DatabaseStore {
  private users: IUser[] = [];
  private complaints: IComplaint[] = [];
  private technicians: ITechnician[] = [];
  private notifications: INotification[] = [];
  private initialized = false;

  constructor() {
    this.init();
  }

  public async init() {
    if (this.initialized) return;
    
    // Hash default demo password: "password123"
    const salt = await bcrypt.genSalt(10);
    const defaultHashedPassword = await bcrypt.hash('password123', salt);

    // Initial Users
    this.users = [
      {
        _id: 'usr_admin_1',
        id: 'usr_admin_1',
        name: 'Elena Rostova (Admin)',
        email: 'admin@fixmate.com',
        phone: '+1 (555) 019-2834',
        password: defaultHashedPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-01-10T08:00:00.000Z',
        updatedAt: '2026-01-10T08:00:00.000Z'
      },
      {
        _id: 'usr_tech_1',
        id: 'usr_tech_1',
        name: 'Alex Rivera',
        email: 'tech.alex@fixmate.com',
        phone: '+1 (555) 392-1049',
        password: defaultHashedPassword,
        role: 'technician',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-01-12T09:00:00.000Z',
        updatedAt: '2026-01-12T09:00:00.000Z'
      },
      {
        _id: 'usr_tech_2',
        id: 'usr_tech_2',
        name: 'Marcus Vance',
        email: 'tech.marcus@fixmate.com',
        phone: '+1 (555) 441-8822',
        password: defaultHashedPassword,
        role: 'technician',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-01-15T10:00:00.000Z',
        updatedAt: '2026-01-15T10:00:00.000Z'
      },
      {
        _id: 'usr_user_1',
        id: 'usr_user_1',
        name: 'Sarah Jenkins',
        email: 'sarah@example.com',
        phone: '+1 (555) 234-5678',
        password: defaultHashedPassword,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-02-01T11:00:00.000Z',
        updatedAt: '2026-02-01T11:00:00.000Z'
      },
      {
        _id: 'usr_user_2',
        id: 'usr_user_2',
        name: 'David Chen',
        email: 'david@example.com',
        phone: '+1 (555) 876-5432',
        password: defaultHashedPassword,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-02-10T14:30:00.000Z',
        updatedAt: '2026-02-10T14:30:00.000Z'
      }
    ];

    // Initial Technicians Catalog
    this.technicians = [
      {
        _id: 'tech_1',
        id: 'tech_1',
        userId: 'usr_tech_1',
        name: 'Alex Rivera',
        email: 'tech.alex@fixmate.com',
        phone: '+1 (555) 392-1049',
        specialization: 'Electrician',
        experienceYears: 7,
        rating: 4.9,
        totalResolved: 142,
        activeJobs: 2,
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-01-12T09:00:00.000Z'
      },
      {
        _id: 'tech_2',
        id: 'tech_2',
        userId: 'usr_tech_2',
        name: 'Marcus Vance',
        email: 'tech.marcus@fixmate.com',
        phone: '+1 (555) 441-8822',
        specialization: 'Plumber',
        experienceYears: 9,
        rating: 4.8,
        totalResolved: 188,
        activeJobs: 1,
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-01-15T10:00:00.000Z'
      },
      {
        _id: 'tech_3',
        id: 'tech_3',
        name: 'Priya Sharma',
        email: 'priya.s@fixmate.com',
        phone: '+1 (555) 773-9911',
        specialization: 'AC Repair',
        experienceYears: 6,
        rating: 4.95,
        totalResolved: 95,
        activeJobs: 0,
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-01-20T12:00:00.000Z'
      },
      {
        _id: 'tech_4',
        id: 'tech_4',
        name: 'Liam Foster',
        email: 'liam.foster@fixmate.com',
        phone: '+1 (555) 612-4433',
        specialization: 'Internet/WiFi',
        experienceYears: 5,
        rating: 4.7,
        totalResolved: 110,
        activeJobs: 1,
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-02-01T09:00:00.000Z'
      },
      {
        _id: 'tech_5',
        id: 'tech_5',
        name: 'Carlos Mendez',
        email: 'carlos.m@fixmate.com',
        phone: '+1 (555) 902-3311',
        specialization: 'Appliance Repair',
        experienceYears: 8,
        rating: 4.85,
        totalResolved: 164,
        activeJobs: 2,
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-02-05T10:00:00.000Z'
      }
    ];

    // Initial Complaints
    this.complaints = [
      {
        _id: 'cmp_1001',
        id: 'cmp_1001',
        complaintId: 'FIX-2026-0101',
        userId: 'usr_user_1',
        userName: 'Sarah Jenkins',
        userEmail: 'sarah@example.com',
        userPhone: '+1 (555) 234-5678',
        category: 'Electrician',
        description: 'Main circuit breaker trips whenever the kitchen oven and microwave run simultaneously. Sparking sound observed behind the main distribution panel.',
        location: 'Apt 4B, 742 Evergreen Terrace, Springfield',
        preferredDate: '2026-09-20',
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
        priority: 'Urgent',
        status: 'In Progress',
        assignedTechnicianId: 'tech_1',
        assignedTechnicianName: 'Alex Rivera',
        assignedTechnicianPhone: '+1 (555) 392-1049',
        aiAnalysis: {
          suggestedCategory: 'Electrician',
          suggestedPriority: 'Urgent',
          problemSummary: 'Electrical overload & potential short circuit hazard at main panel',
          suggestedNextStep: 'Isolate circuit breaker immediately. Dispatch certified electrician with thermal multimeter.',
          confidenceScore: 0.98,
          tags: ['circuit-breaker', 'fire-hazard', 'overload']
        },
        timeline: [
          {
            id: 'tml_1',
            status: 'Pending',
            title: 'Complaint Logged',
            description: 'Customer submitted urgent electrical issue with AI risk analysis.',
            timestamp: '2026-09-17T09:15:00.000Z',
            performedBy: 'Sarah Jenkins'
          },
          {
            id: 'tml_2',
            status: 'Assigned',
            title: 'Technician Assigned',
            description: 'Assigned to Senior Electrical Specialist Alex Rivera.',
            timestamp: '2026-09-17T09:30:00.000Z',
            performedBy: 'Admin Dispatcher'
          },
          {
            id: 'tml_3',
            status: 'In Progress',
            title: 'Diagnosis & Inspection',
            description: 'Technician on site. Testing 40A dual-pole breaker for thermal wear.',
            timestamp: '2026-09-17T11:00:00.000Z',
            performedBy: 'Alex Rivera'
          }
        ],
        workNotes: [
          {
            id: 'wn_1',
            author: 'Alex Rivera',
            role: 'technician',
            note: 'Inspected panel. Found loose neutral wire and burnt terminal on Circuit #4. Replacing 40A Schneider breaker.',
            timestamp: '2026-09-17T11:20:00.000Z',
            partsUsed: '40A Schneider Dual-Pole Breaker, Copper Lugs'
          }
        ],
        createdAt: '2026-09-17T09:15:00.000Z',
        updatedAt: '2026-09-17T11:20:00.000Z'
      },
      {
        _id: 'cmp_1002',
        id: 'cmp_1002',
        complaintId: 'FIX-2026-0102',
        userId: 'usr_user_1',
        userName: 'Sarah Jenkins',
        userEmail: 'sarah@example.com',
        userPhone: '+1 (555) 234-5678',
        category: 'Plumber',
        description: 'Under-sink kitchen drainage pipe has a persistent hairline crack causing slow water leakage onto cabinetry wood floor.',
        location: 'Apt 4B, 742 Evergreen Terrace, Springfield',
        preferredDate: '2026-09-22',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
        priority: 'Medium',
        status: 'Assigned',
        assignedTechnicianId: 'tech_2',
        assignedTechnicianName: 'Marcus Vance',
        assignedTechnicianPhone: '+1 (555) 441-8822',
        aiAnalysis: {
          suggestedCategory: 'Plumber',
          suggestedPriority: 'Medium',
          problemSummary: 'P-trap drainpipe stress fracture with secondary moisture damage risk',
          suggestedNextStep: 'Place basin underneath to catch drips. Schedule PVC P-trap replacement.',
          confidenceScore: 0.94,
          tags: ['drainage', 'p-trap', 'leak']
        },
        timeline: [
          {
            id: 'tml_4',
            status: 'Pending',
            title: 'Complaint Registered',
            description: 'Issue reported for kitchen drainage line.',
            timestamp: '2026-09-16T14:20:00.000Z',
            performedBy: 'Sarah Jenkins'
          },
          {
            id: 'tml_5',
            status: 'Assigned',
            title: 'Technician Assigned',
            description: 'Allocated to Master Plumber Marcus Vance.',
            timestamp: '2026-09-16T15:00:00.000Z',
            performedBy: 'System Auto-Router'
          }
        ],
        createdAt: '2026-09-16T14:20:00.000Z',
        updatedAt: '2026-09-16T15:00:00.000Z'
      },
      {
        _id: 'cmp_1003',
        id: 'cmp_1003',
        complaintId: 'FIX-2026-0103',
        userId: 'usr_user_2',
        userName: 'David Chen',
        userEmail: 'david@example.com',
        userPhone: '+1 (555) 876-5432',
        category: 'AC Repair',
        description: 'Living room inverter AC unit is blowing ambient warm air despite being set to 18°C cool mode. Error code E4 blinking on display.',
        location: 'Unit 1205, Skyview Tower, Downtown Metro',
        preferredDate: '2026-09-19',
        imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80',
        priority: 'High',
        status: 'Completed',
        assignedTechnicianId: 'tech_3',
        assignedTechnicianName: 'Priya Sharma',
        assignedTechnicianPhone: '+1 (555) 773-9911',
        aiAnalysis: {
          suggestedCategory: 'AC Repair',
          suggestedPriority: 'High',
          problemSummary: 'Refrigerant pressure drop or compressor capacitor malfunction (E4 error code)',
          suggestedNextStep: 'Check refrigerant line pressure with manifold gauge and test capacitor resistance.',
          confidenceScore: 0.96,
          tags: ['hvac', 'refrigerant', 'capacitor']
        },
        timeline: [
          {
            id: 'tml_6',
            status: 'Pending',
            title: 'Complaint Logged',
            description: 'David Chen submitted HVAC issue.',
            timestamp: '2026-09-15T08:10:00.000Z',
            performedBy: 'David Chen'
          },
          {
            id: 'tml_7',
            status: 'Assigned',
            title: 'Assigned to Priya Sharma',
            description: 'HVAC technician dispatched.',
            timestamp: '2026-09-15T08:45:00.000Z',
            performedBy: 'Elena Rostova'
          },
          {
            id: 'tml_8',
            status: 'In Progress',
            title: 'On-Site Repair',
            description: 'Refilling R410A refrigerant and cleaned outdoor condenser coil.',
            timestamp: '2026-09-15T13:00:00.000Z',
            performedBy: 'Priya Sharma'
          },
          {
            id: 'tml_9',
            status: 'Completed',
            title: 'Service Verified & Closed',
            description: 'System running at optimal 16°C delta. Customer signed off.',
            timestamp: '2026-09-15T14:40:00.000Z',
            performedBy: 'Priya Sharma'
          }
        ],
        workNotes: [
          {
            id: 'wn_2',
            author: 'Priya Sharma',
            role: 'technician',
            note: 'Fixed minor flare nut leak, vacuumed system, and recharged with 750g R410A refrigerant. Temperature output measured at 9.5°C at vent.',
            timestamp: '2026-09-15T14:30:00.000Z',
            partsUsed: 'R410A Refrigerant (750g), 1/4" Brass Flare Nut'
          }
        ],
        resolutionSummary: 'Successfully sealed flare nut refrigerant leak and recharged system. Cooling performance restored to factory spec.',
        rating: 5,
        feedback: 'Fantastic and speedy repair! Room became ice cold within 15 minutes of completion.',
        createdAt: '2026-09-15T08:10:00.000Z',
        updatedAt: '2026-09-15T14:40:00.000Z'
      },
      {
        _id: 'cmp_1004',
        id: 'cmp_1004',
        complaintId: 'FIX-2026-0104',
        userId: 'usr_user_2',
        userName: 'David Chen',
        userEmail: 'david@example.com',
        userPhone: '+1 (555) 876-5432',
        category: 'Internet/WiFi',
        description: 'Fibre optic ONT modem LOS red light flashing rapidly. No internet across all Ethernet LAN and WiFi devices.',
        location: 'Unit 1205, Skyview Tower, Downtown Metro',
        preferredDate: '2026-09-21',
        priority: 'High',
        status: 'Pending',
        aiAnalysis: {
          suggestedCategory: 'Internet/WiFi',
          suggestedPriority: 'High',
          problemSummary: 'Optical Loss of Signal (LOS) on FTTH network terminal',
          suggestedNextStep: 'Check fibre patch cord for micro-bends. Splice inspection required at terminal box.',
          confidenceScore: 0.99,
          tags: ['fiber-optics', 'ont', 'network-down']
        },
        timeline: [
          {
            id: 'tml_10',
            status: 'Pending',
            title: 'Complaint Registered',
            description: 'Fiber connectivity loss ticket created.',
            timestamp: '2026-09-17T16:00:00.000Z',
            performedBy: 'David Chen'
          }
        ],
        createdAt: '2026-09-17T16:00:00.000Z',
        updatedAt: '2026-09-17T16:00:00.000Z'
      }
    ];

    // Initial Notifications
    this.notifications = [
      {
        _id: 'notif_1',
        id: 'notif_1',
        userId: 'usr_user_1',
        title: 'Technician Dispatched',
        message: 'Alex Rivera is currently reviewing your urgent electrical ticket FIX-2026-0101.',
        type: 'assignment',
        complaintId: 'cmp_1001',
        isRead: false,
        createdAt: '2026-09-17T09:30:00.000Z'
      },
      {
        _id: 'notif_2',
        id: 'notif_2',
        userId: 'usr_user_1',
        title: 'Status Updated to In Progress',
        message: 'Work on ticket FIX-2026-0101 has commenced at your location.',
        type: 'status_change',
        complaintId: 'cmp_1001',
        isRead: false,
        createdAt: '2026-09-17T11:00:00.000Z'
      },
      {
        _id: 'notif_3',
        id: 'notif_3',
        userId: 'usr_user_2',
        title: 'Complaint Resolved',
        message: 'AC Repair ticket FIX-2026-0103 was marked as completed by Priya Sharma.',
        type: 'success',
        complaintId: 'cmp_1003',
        isRead: true,
        createdAt: '2026-09-15T14:40:00.000Z'
      },
      {
        _id: 'notif_4',
        id: 'notif_4',
        userId: 'usr_admin_1',
        title: 'New High Priority Ticket',
        message: 'A new urgent electrical complaint FIX-2026-0101 requires review.',
        type: 'warning',
        complaintId: 'cmp_1001',
        isRead: false,
        createdAt: '2026-09-17T09:15:00.000Z'
      }
    ];

    this.initialized = true;
  }

  // User Methods
  public async getUsers(): Promise<IUser[]> {
    await this.init();
    return [...this.users];
  }

  public async getUserById(id: string): Promise<IUser | undefined> {
    await this.init();
    return this.users.find(u => u._id === id || u.id === id);
  }

  public async getUserByEmail(email: string): Promise<IUser | undefined> {
    await this.init();
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public async createUser(userData: Omit<IUser, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    await this.init();
    const id = 'usr_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();
    const newUser: IUser = {
      _id: id,
      id,
      ...userData,
      createdAt: now,
      updatedAt: now
    };
    this.users.push(newUser);
    return newUser;
  }

  public async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | undefined> {
    await this.init();
    const index = this.users.findIndex(u => u._id === id || u.id === id);
    if (index === -1) return undefined;
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.users[index];
  }

  // Complaint Methods
  public async getComplaints(): Promise<IComplaint[]> {
    await this.init();
    return [...this.complaints];
  }

  public async getComplaintById(id: string): Promise<IComplaint | undefined> {
    await this.init();
    return this.complaints.find(c => c._id === id || c.id === id || c.complaintId === id);
  }

  public async createComplaint(data: Omit<IComplaint, '_id' | 'id' | 'complaintId' | 'timeline' | 'createdAt' | 'updatedAt'>): Promise<IComplaint> {
    await this.init();
    const id = 'cmp_' + Math.random().toString(36).substring(2, 9);
    const count = this.complaints.length + 101;
    const complaintId = `FIX-2026-${String(count).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const newComplaint: IComplaint = {
      _id: id,
      id,
      complaintId,
      ...data,
      status: 'Pending',
      timeline: [
        {
          id: 'tml_' + Math.random().toString(36).substring(2, 9),
          status: 'Pending',
          title: 'Complaint Registered',
          description: 'Issue reported and queued for smart triage.',
          timestamp: now,
          performedBy: data.userName
        }
      ],
      workNotes: [],
      createdAt: now,
      updatedAt: now
    };

    this.complaints.unshift(newComplaint);

    // Create notification for Admins
    await this.createNotification({
      userId: 'usr_admin_1',
      title: `New Ticket: ${complaintId}`,
      message: `${data.userName} reported a ${data.priority} priority ${data.category} issue.`,
      type: data.priority === 'Urgent' ? 'warning' : 'info',
      complaintId: id,
      isRead: false
    });

    return newComplaint;
  }

  public async updateComplaint(id: string, updates: Partial<IComplaint>): Promise<IComplaint | undefined> {
    await this.init();
    const index = this.complaints.findIndex(c => c._id === id || c.id === id || c.complaintId === id);
    if (index === -1) return undefined;

    const current = this.complaints[index];
    const now = new Date().toISOString();
    
    // Add timeline event if status changed
    let timeline = current.timeline || [];
    if (updates.status && updates.status !== current.status) {
      timeline.push({
        id: 'tml_' + Math.random().toString(36).substring(2, 9),
        status: updates.status,
        title: `Status Changed to ${updates.status}`,
        description: updates.resolutionSummary || `Ticket status advanced to ${updates.status}.`,
        timestamp: now,
        performedBy: updates.assignedTechnicianName || 'System Admin'
      });

      // Send notification to customer
      await this.createNotification({
        userId: current.userId,
        title: `Ticket ${current.complaintId} Updated`,
        message: `Your complaint is now marked as "${updates.status}".`,
        type: updates.status === 'Completed' ? 'success' : 'status_change',
        complaintId: current._id,
        isRead: false
      });
    }

    // Add timeline event if technician assigned
    if (updates.assignedTechnicianId && updates.assignedTechnicianId !== current.assignedTechnicianId) {
      timeline.push({
        id: 'tml_' + Math.random().toString(36).substring(2, 9),
        status: 'Assigned',
        title: 'Technician Assigned',
        description: `Dispatched to specialist ${updates.assignedTechnicianName || 'Technician'}.`,
        timestamp: now,
        performedBy: 'Admin Dispatcher'
      });

      // Notify customer
      await this.createNotification({
        userId: current.userId,
        title: `Technician Assigned`,
        message: `${updates.assignedTechnicianName} has been assigned to ticket ${current.complaintId}.`,
        type: 'assignment',
        complaintId: current._id,
        isRead: false
      });
    }

    this.complaints[index] = {
      ...current,
      ...updates,
      timeline,
      updatedAt: now
    };

    return this.complaints[index];
  }

  public async deleteComplaint(id: string): Promise<boolean> {
    await this.init();
    const index = this.complaints.findIndex(c => c._id === id || c.id === id || c.complaintId === id);
    if (index === -1) return false;
    this.complaints.splice(index, 1);
    return true;
  }

  // Technician Methods
  public async getTechnicians(): Promise<ITechnician[]> {
    await this.init();
    return [...this.technicians];
  }

  public async getTechnicianById(id: string): Promise<ITechnician | undefined> {
    await this.init();
    return this.technicians.find(t => t._id === id || t.id === id || t.userId === id);
  }

  public async createTechnician(data: Omit<ITechnician, '_id' | 'id' | 'createdAt'>): Promise<ITechnician> {
    await this.init();
    const id = 'tech_' + Math.random().toString(36).substring(2, 9);
    const newTech: ITechnician = {
      _id: id,
      id,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.technicians.push(newTech);
    return newTech;
  }

  // Notification Methods
  public async getNotifications(userId?: string): Promise<INotification[]> {
    await this.init();
    if (!userId) return [...this.notifications];
    return this.notifications.filter(n => n.userId === userId || n.userId === 'usr_admin_1');
  }

  public async createNotification(data: Omit<INotification, '_id' | 'id' | 'createdAt'>): Promise<INotification> {
    await this.init();
    const id = 'notif_' + Math.random().toString(36).substring(2, 9);
    const newNotif: INotification = {
      _id: id,
      id,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  public async markNotificationRead(id: string): Promise<boolean> {
    await this.init();
    const notif = this.notifications.find(n => n._id === id || n.id === id);
    if (!notif) return false;
    notif.isRead = true;
    return true;
  }

  public async markAllNotificationsRead(userId: string): Promise<boolean> {
    await this.init();
    this.notifications.forEach(n => {
      if (n.userId === userId || (!userId && n.userId === 'usr_admin_1')) {
        n.isRead = true;
      }
    });
    return true;
  }
}

export const db = new DatabaseStore();
