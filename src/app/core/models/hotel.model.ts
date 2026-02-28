export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  stars: number;
  isActive: boolean;
  imageUrl: string;
  rooms: Room[];
}

export interface Room {
  id: string;
  hotelId: string;
  type: RoomType;
  baseCost: number;
  taxes: number;
  location: string;
  isAvailable: boolean;
  capacity: number;
}

export type RoomType = 'single' | 'double' | 'suite' | 'family';

export interface HotelSearchFilters {
  city: string;
  checkIn: string;
  checkOut?: string;
}
