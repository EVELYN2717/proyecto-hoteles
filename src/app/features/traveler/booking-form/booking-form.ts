import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelService } from '../../../core/services/hotel.service';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../shared/components/notification/notification.service';
import { Hotel, Room } from '../../../core/models/hotel.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-booking-form',
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.scss',
})
export class BookingFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly hotelService = inject(HotelService);
  private readonly bookingService = inject(BookingService);
  private readonly notifications = inject(NotificationService);

  protected hotel = signal<Hotel | null>(null);
  protected room = signal<Room | null>(null);
  protected guestForm!: FormGroup;
  protected emergencyForm!: FormGroup;

  ngOnInit(): void {
    const hotelId = this.route.snapshot.paramMap.get('id');
    const roomId = this.route.snapshot.paramMap.get('roomId');

    if (hotelId && roomId) {
      const h = this.hotelService.getById(hotelId);
      if (h) {
        this.hotel.set(h);
        const r = h.rooms.find(rm => rm.id === roomId);
        if (r && r.isAvailable) {
          this.room.set(r);
        } else {
          this.notifications.error('Habitación no disponible');
          this.router.navigate(['/traveler/hotel', hotelId]);
          return;
        }
      } else {
        this.router.navigate(['/traveler/search']);
        return;
      }
    }

    this.guestForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(7)]],
    });

    this.emergencyForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  get totalCost(): number {
    const r = this.room();
    return r ? r.baseCost + r.taxes : 0;
  }

  onSubmit(): void {
    if (this.guestForm.invalid || this.emergencyForm.invalid) {
      this.guestForm.markAllAsTouched();
      this.emergencyForm.markAllAsTouched();
      return;
    }

    const h = this.hotel();
    const r = this.room();
    if (!h || !r) return;

    const booking = this.bookingService.create({
      hotelId: h.id,
      hotelName: h.name,
      roomId: r.id,
      roomType: r.type,
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: '',
      guest: this.guestForm.value,
      emergencyContact: this.emergencyForm.value,
      totalCost: this.totalCost,
    });

    this.hotelService.toggleRoomAvailability(h.id, r.id);
    this.notifications.success('Reserva creada exitosamente');
    this.router.navigate(['/traveler/booking-confirmation', booking.id]);
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!control && control.invalid && control.touched;
  }
}
