import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
}

export type ToastType = ToastMessage['type'];

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = new BehaviorSubject<ToastMessage[]>([]);
  public toasts$ = this._toasts.asObservable();

  showToast(title: string, message: string, type: ToastType = 'info') {
    const newToast: ToastMessage = {
      id: Date.now(),
      title,
      message,
      type
    };

    // Emitir inmediatamente
    this._toasts.next([...this._toasts.getValue(), newToast]);

    // Auto eliminar en 4s
    setTimeout(() => this.dismiss(newToast.id), 4000);
  }

  dismiss(id: number) {
    this._toasts.next(this._toasts.getValue().filter(t => t.id !== id));

  }
}
