import { Injectable, signal, computed } from '@angular/core';
import { Hotel, Room } from '../models/hotel.model';

const uuid = () => crypto.randomUUID();

const SEED_HOTELS: Hotel[] = [
  {
    id: uuid(),
    name: 'Hotel Tequendama',
    city: 'Bogota',
    address: 'Carrera 10 #26-21',
    description: 'Hotel emblemático en el corazón de Bogotá con vistas panorámicas.',
    stars: 5,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    rooms: [
      { id: uuid(), hotelId: '', type: 'single', baseCost: 180000, taxes: 34200, location: 'Piso 3 - Hab 301', isAvailable: true, capacity: 1 },
      { id: uuid(), hotelId: '', type: 'double', baseCost: 280000, taxes: 53200, location: 'Piso 5 - Hab 502', isAvailable: true, capacity: 2 },
      { id: uuid(), hotelId: '', type: 'suite', baseCost: 520000, taxes: 98800, location: 'Piso 10 - Hab 1001', isAvailable: true, capacity: 3 },
    ],
  },
  {
    id: uuid(),
    name: 'Hotel Caribe',
    city: 'Cartagena',
    address: 'Cra. 1 #2-87, Bocagrande',
    description: 'Resort frente al mar con piscinas y acceso directo a la playa.',
    stars: 4,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
    rooms: [
      { id: uuid(), hotelId: '', type: 'double', baseCost: 350000, taxes: 66500, location: 'Piso 2 - Hab 204', isAvailable: true, capacity: 2 },
      { id: uuid(), hotelId: '', type: 'family', baseCost: 480000, taxes: 91200, location: 'Piso 4 - Hab 410', isAvailable: true, capacity: 4 },
      { id: uuid(), hotelId: '', type: 'suite', baseCost: 750000, taxes: 142500, location: 'Piso 8 - Hab 801', isAvailable: false, capacity: 3 },
    ],
  },
  {
    id: uuid(),
    name: 'Hotel Nutibara',
    city: 'Medellin',
    address: 'Calle 52A #50-46',
    description: 'Hotel histórico en el centro de Medellín, ideal para negocios y turismo.',
    stars: 4,
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    rooms: [
      { id: uuid(), hotelId: '', type: 'single', baseCost: 150000, taxes: 28500, location: 'Piso 2 - Hab 205', isAvailable: true, capacity: 1 },
      { id: uuid(), hotelId: '', type: 'double', baseCost: 250000, taxes: 47500, location: 'Piso 3 - Hab 310', isAvailable: true, capacity: 2 },
      { id: uuid(), hotelId: '', type: 'family', baseCost: 420000, taxes: 79800, location: 'Piso 6 - Hab 604', isAvailable: true, capacity: 4 },
    ],
  },
  {
    id: uuid(),
    name: 'Hotel Dann Carlton',
    city: 'Bogota',
    address: 'Calle 93B #19-44',
    description: 'Hotel de lujo en la zona norte con spa y restaurante gourmet.',
    stars: 5,
    isActive: false,
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
    rooms: [
      { id: uuid(), hotelId: '', type: 'double', baseCost: 320000, taxes: 60800, location: 'Piso 7 - Hab 712', isAvailable: true, capacity: 2 },
      { id: uuid(), hotelId: '', type: 'suite', baseCost: 600000, taxes: 114000, location: 'Piso 15 - Hab 1501', isAvailable: true, capacity: 3 },
    ],
  },
];

function linkRoomsToHotel(hotel: Hotel): Hotel {
  return {
    ...hotel,
    rooms: hotel.rooms.map(r => ({ ...r, hotelId: hotel.id })),
  };
}

@Injectable({ providedIn: 'root' })
export class HotelService {
  private readonly _hotels = signal<Hotel[]>(
    SEED_HOTELS.map(linkRoomsToHotel),
  );

  readonly hotels = this._hotels.asReadonly();
  readonly activeHotels = computed(() => this._hotels().filter(h => h.isActive));

  getById(id: string): Hotel | undefined {
    return this._hotels().find(h => h.id === id);
  }

  searchByCity(city: string): Hotel[] {
    const term = city.toLowerCase().trim();
    return this.activeHotels().filter(h =>
      h.city.toLowerCase().includes(term),
    );
  }

  create(data: Omit<Hotel, 'id' | 'rooms'>): Hotel {
    const hotel: Hotel = { ...data, id: uuid(), rooms: [] };
    this._hotels.update(list => [...list, hotel]);
    return hotel;
  }

  update(id: string, data: Partial<Hotel>): Hotel | undefined {
    let updated: Hotel | undefined;
    this._hotels.update(list =>
      list.map(h => {
        if (h.id === id) {
          updated = { ...h, ...data, id: h.id };
          return updated;
        }
        return h;
      }),
    );
    return updated;
  }

  toggleActive(id: string): void {
    this._hotels.update(list =>
      list.map(h => (h.id === id ? { ...h, isActive: !h.isActive } : h)),
    );
  }

  addRoom(hotelId: string, room: Omit<Room, 'id' | 'hotelId'>): Room | undefined {
    const newRoom: Room = { ...room, id: uuid(), hotelId };
    this._hotels.update(list =>
      list.map(h =>
        h.id === hotelId ? { ...h, rooms: [...h.rooms, newRoom] } : h,
      ),
    );
    return newRoom;
  }

  updateRoom(hotelId: string, roomId: string, data: Partial<Room>): void {
    this._hotels.update(list =>
      list.map(h =>
        h.id === hotelId
          ? {
              ...h,
              rooms: h.rooms.map(r =>
                r.id === roomId ? { ...r, ...data, id: roomId, hotelId } : r,
              ),
            }
          : h,
      ),
    );
  }

  toggleRoomAvailability(hotelId: string, roomId: string): void {
    this._hotels.update(list =>
      list.map(h =>
        h.id === hotelId
          ? {
              ...h,
              rooms: h.rooms.map(r =>
                r.id === roomId ? { ...r, isAvailable: !r.isAvailable } : r,
              ),
            }
          : h,
      ),
    );
  }
}
