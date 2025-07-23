import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
    selector: 'app-toast-container',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast-container.component.html',
    styleUrls: ['./toast-container.component.css']
})

export class ToastContainerComponent {
    toasts: ToastMessage[] = [];

    constructor(
        private toastService: ToastService,
        private cdr: ChangeDetectorRef
    ) {
        this.toastService.toasts$.subscribe(toasts => {
            this.toasts = toasts;
            this.cdr.detectChanges();
        });
    }

    dismiss(id: number) {
        this.toastService.dismiss(id);
    }

    getToastColor(type: ToastMessage['type']): string {
        switch (type) {
            case 'success': return '#198754';
            case 'danger': return '#dc3545';
            case 'warning': return '#ffc107';
            default: return '#0d6efd';
        }
    }

    getToastEmoji(type: ToastMessage['type']): string {
        switch (type) {
            case 'success': return '✔️';
            case 'danger': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }
}