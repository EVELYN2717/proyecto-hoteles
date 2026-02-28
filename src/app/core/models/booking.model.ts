export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guest: Guest;
  emergencyContact: EmergencyContact;
  totalCost: number;
  createdAt: string;
}

export interface Guest {
  fullName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  documentType: 'cc' | 'ce' | 'passport';
  documentNumber: string;
  email: string;
  phone: string;
}

export interface EmergencyContact {
  fullName: string;
  phone: string;
}
