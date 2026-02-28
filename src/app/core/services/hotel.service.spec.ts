import { TestBed } from '@angular/core/testing';
import { HotelService } from './hotel.service';

describe('HotelService', () => {
  let service: HotelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have seed hotels loaded', () => {
    expect(service.hotels().length).toBeGreaterThan(0);
  });

  it('should return only active hotels in activeHotels', () => {
    const active = service.activeHotels();
    active.forEach(h => expect(h.isActive).toBe(true));
  });

  it('should create a new hotel', () => {
    const initialCount = service.hotels().length;
    const created = service.create({
      name: 'Hotel Test',
      city: 'Cali',
      address: 'Calle Test #123',
      description: 'Hotel de prueba para tests',
      stars: 3,
      isActive: true,
      imageUrl: 'https://example.com/img.jpg',
    });

    expect(created.id).toBeTruthy();
    expect(created.name).toBe('Hotel Test');
    expect(service.hotels().length).toBe(initialCount + 1);
  });

  it('should find a hotel by id', () => {
    const first = service.hotels()[0];
    const found = service.getById(first.id);
    expect(found).toBeDefined();
    expect(found!.name).toBe(first.name);
  });

  it('should return undefined for non-existent id', () => {
    expect(service.getById('non-existent')).toBeUndefined();
  });

  it('should update a hotel', () => {
    const first = service.hotels()[0];
    const updated = service.update(first.id, { name: 'Renamed Hotel' });
    expect(updated).toBeDefined();
    expect(updated!.name).toBe('Renamed Hotel');
    expect(service.getById(first.id)?.name).toBe('Renamed Hotel');
  });

  it('should toggle hotel active status', () => {
    const first = service.hotels()[0];
    const originalStatus = first.isActive;
    service.toggleActive(first.id);
    expect(service.getById(first.id)?.isActive).toBe(!originalStatus);
  });

  it('should search hotels by city', () => {
    const bogotaHotels = service.searchByCity('Bogota');
    bogotaHotels.forEach(h => {
      expect(h.city.toLowerCase()).toContain('bogota');
      expect(h.isActive).toBe(true);
    });
  });

  it('should add a room to a hotel', () => {
    const first = service.hotels()[0];
    const initialRoomCount = first.rooms.length;
    const room = service.addRoom(first.id, {
      type: 'single',
      baseCost: 100000,
      taxes: 19000,
      location: 'Piso 1 - Hab 101',
      isAvailable: true,
      capacity: 1,
    });

    expect(room).toBeDefined();
    expect(service.getById(first.id)?.rooms.length).toBe(initialRoomCount + 1);
  });

  it('should toggle room availability', () => {
    const hotel = service.hotels()[0];
    const room = hotel.rooms[0];
    const originalAvail = room.isAvailable;

    service.toggleRoomAvailability(hotel.id, room.id);
    const updatedRoom = service.getById(hotel.id)?.rooms.find(r => r.id === room.id);
    expect(updatedRoom?.isAvailable).toBe(!originalAvail);
  });
});
