import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelService } from '../../../core/services/hotel.service';
import { Hotel, Room, RoomType } from '../../../core/models/hotel.model';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-hotel-form',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './hotel-form.html',
  styleUrl: './hotel-form.scss',
})
export class HotelFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly hotelService = inject(HotelService);
  private readonly notifications = inject(NotificationService);

  protected hotelForm!: FormGroup;
  protected roomForm!: FormGroup;
  protected isEdit = signal(false);
  protected hotel = signal<Hotel | null>(null);
  protected showRoomForm = signal(false);
  protected editingRoomId = signal<string | null>(null);

  readonly roomTypes: { value: RoomType; label: string }[] = [
    { value: 'single', label: 'Individual' },
    { value: 'double', label: 'Doble' },
    { value: 'suite', label: 'Suite' },
    { value: 'family', label: 'Familiar' },
  ];

  ngOnInit(): void {
    this.hotelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      stars: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      imageUrl: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'],
    });

    this.roomForm = this.fb.group({
      type: ['single', Validators.required],
      baseCost: [0, [Validators.required, Validators.min(1)]],
      taxes: [0, [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      capacity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const existing = this.hotelService.getById(id);
      if (existing) {
        this.isEdit.set(true);
        this.hotel.set(existing);
        this.hotelForm.patchValue({
          name: existing.name,
          city: existing.city,
          address: existing.address,
          description: existing.description,
          stars: existing.stars,
          imageUrl: existing.imageUrl,
        });
      } else {
        this.notifications.error('Hotel no encontrado');
        this.router.navigate(['/admin/hotels']);
      }
    }
  }

  onSubmit(): void {
    if (this.hotelForm.invalid) {
      this.hotelForm.markAllAsTouched();
      return;
    }

    const formData = this.hotelForm.value;

    if (this.isEdit() && this.hotel()) {
      this.hotelService.update(this.hotel()!.id, formData);
      this.notifications.success('Hotel actualizado exitosamente');
    } else {
      this.hotelService.create({ ...formData, isActive: true });
      this.notifications.success('Hotel creado exitosamente');
    }

    this.router.navigate(['/admin/hotels']);
  }

  openRoomForm(room?: Room): void {
    this.showRoomForm.set(true);
    if (room) {
      this.editingRoomId.set(room.id);
      this.roomForm.patchValue({
        type: room.type,
        baseCost: room.baseCost,
        taxes: room.taxes,
        location: room.location,
        capacity: room.capacity,
      });
    } else {
      this.editingRoomId.set(null);
      this.roomForm.reset({ type: 'single', baseCost: 0, taxes: 0, location: '', capacity: 1 });
    }
  }

  cancelRoomForm(): void {
    this.showRoomForm.set(false);
    this.editingRoomId.set(null);
  }

  saveRoom(): void {
    if (this.roomForm.invalid || !this.hotel()) {
      this.roomForm.markAllAsTouched();
      return;
    }

    const data = this.roomForm.value;
    const hotelId = this.hotel()!.id;

    if (this.editingRoomId()) {
      this.hotelService.updateRoom(hotelId, this.editingRoomId()!, data);
      this.notifications.success('Habitación actualizada');
    } else {
      this.hotelService.addRoom(hotelId, { ...data, isAvailable: true });
      this.notifications.success('Habitación agregada');
    }

    this.hotel.set(this.hotelService.getById(hotelId) ?? null);
    this.cancelRoomForm();
  }

  toggleRoomAvailability(roomId: string): void {
    if (!this.hotel()) return;
    this.hotelService.toggleRoomAvailability(this.hotel()!.id, roomId);
    this.hotel.set(this.hotelService.getById(this.hotel()!.id) ?? null);
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && control.invalid && control.touched;
  }
}
