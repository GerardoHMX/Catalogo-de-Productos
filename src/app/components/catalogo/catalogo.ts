import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Producto } from '../../models/producto.model';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { ToastService, ToastMessage } from '../../services/toast.service';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css']
})
export class CatalogoComponent implements OnInit, AfterViewInit {
  mensajeError: string = '';
  productos: Producto[] = [
    { id: 1, nombre: 'Mac Book Pro', precio: 2600, fechaEntrega: '2025-07-15', correoProveedor: 'proveedor1@gmail.com' },
    { id: 2, nombre: 'iPad Pro', precio: 1500, fechaEntrega: '2025-07-18', correoProveedor: 'proveedor2@gmail.com' },
    { id: 3, nombre: 'Iphone 15', precio: 800, fechaEntrega: '2025-07-20', correoProveedor: 'proveedor3@gmail.com' },
    { id: 4, nombre: 'Apple Watch', precio: 400, fechaEntrega: '2025-07-22', correoProveedor: 'proveedor4@gmail.com' },
    { id: 5, nombre: 'AirPods Pro', precio: 250, fechaEntrega: '2025-07-25', correoProveedor: 'provedor5@gmail.com' },
    { id: 6, nombre: 'Apple TV', precio: 200, fechaEntrega: '2025-07-28', correoProveedor: 'provedor6@gmail.com' },
    { id: 7, nombre: 'HomePod', precio: 300, fechaEntrega: '2025-07-30', correoProveedor: 'provedor7@gmail.com' },
    { id: 8, nombre: 'Magic Keyboard', precio: 150, fechaEntrega: '2025-08-02', correoProveedor: 'provedor8@gmail.com' },
    { id: 9, nombre: 'Magic Mouse', precio: 100, fechaEntrega: '2025-08-05', correoProveedor: 'provedor9@gmail.com' },
    { id: 10, nombre: 'AirTag', precio: 29, fechaEntrega: '2025-08-07', correoProveedor: 'provedor10@gmail.com' },
    { id: 11, nombre: 'Apple Pencil', precio: 120, fechaEntrega: '2025-08-10', correoProveedor: 'provedor11@gmail.com' },
    { id: 12, nombre: 'Apple Care', precio: 199, fechaEntrega: '2025-08-12', correoProveedor: 'provedor12@gmail.com' },
    { id: 13, nombre: 'AirPods Max', precio: 549, fechaEntrega: '2025-08-15', correoProveedor: 'provedor13@gmail.com' },
    { id: 14, nombre: 'iMac', precio: 1800, fechaEntrega: '2025-08-18', correoProveedor: 'provedor14@gmail.com' },
    { id: 15, nombre: 'Mac Mini', precio: 700, fechaEntrega: '2025-08-20', correoProveedor: 'provedor15@gmail.com' },
    { id: 16, nombre: 'Mac Studio', precio: 2000, fechaEntrega: '2025-08-22', correoProveedor: 'provedor16@gmail.com' }
  ];

  nuevoProducto: Producto = {
    id: 0,
    nombre: '',
    precio: 0,
    fechaEntrega: '',
    correoProveedor: ''
  };

  toasts: ToastMessage[] = [];
  minFecha: string = '';
  maxFecha: string = '';
  editando: boolean = false;
  productoEditando: Producto | null = null;

  @ViewChild('tablaScroll', { static: false }) tablaScroll!: ElementRef;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService
  ) {
    const hoy = new Date();
    const diezAnios = new Date(hoy.getFullYear() + 10, hoy.getMonth(), hoy.getDate());
    this.minFecha = hoy.toISOString().split('T')[0];
    this.maxFecha = diezAnios.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  openModal(content: any, esEdicion = false) {
    this.editando = esEdicion;
    if (!esEdicion) this.resetFormulario();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  nombreInvalido: boolean = false;

  guardarProducto(modal: any, form: NgForm): void {

    if (form.invalid) {
      this.nombreInvalido = false;
      return;
    }

    const nombreLimpio = this.nuevoProducto.nombre.trim().toLowerCase();

    if (!nombreLimpio) {
      this.nombreInvalido = true;
      this.mensajeError = 'El nombre del producto no puede estar vacío ni contener solo espacios.';
      return;
    }

    const yaExiste = this.productos.some(p =>
      p.nombre.trim().toLowerCase() === nombreLimpio &&
      (!this.editando || p.id !== this.nuevoProducto.id)
    );

    if (yaExiste) {
      this.nombreInvalido = true;
      this.mensajeError = `Ya existe un producto con el nombre "${this.nuevoProducto.nombre.trim()}".`;
      return;
    }

    this.nombreInvalido = false;
    this.mensajeError = '';

    const guardar = () => {
      if (this.editando && this.productoEditando) {
        const index = this.productos.indexOf(this.productoEditando);
        if (index !== -1) {
          this.productos[index] = {
            ...this.nuevoProducto,
            nombre: this.nuevoProducto.nombre.trim()
          };
          this.toastService.showToast(
            'Producto actualizado',
            `Se actualizó el producto "${this.nuevoProducto.nombre.trim()}".`,
            'info'
          );
        }
      } else {
        const nuevoId = this.productos.length > 0
          ? Math.max(...this.productos.map(p => p.id)) + 1
          : 1;

        this.productos.push({
          ...this.nuevoProducto,
          id: nuevoId,
          nombre: this.nuevoProducto.nombre.trim()
        });

        this.toastService.showToast(
          'Producto creado',
          `El producto "${this.nuevoProducto.nombre.trim()}" fue creado.`,
          'success'
        );
      }

      modal.close();
      this.resetFormulario();
    };

    if (this.editando) {
      Swal.fire({
        title: '¿Confirmar actualización?',
        text: `¿Deseas actualizar el producto "${this.nuevoProducto.nombre.trim()}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, actualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#0d6efd',
        cancelButtonColor: '#6c757d'
      }).then(result => {
        if (result.isConfirmed) {
          guardar();
        }
      });
    } else {
      guardar();
    }
  }

  resetFormulario(): void {
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      precio: 0,
      fechaEntrega: '',
      correoProveedor: ''
    };
    this.productoEditando = null;
    this.mensajeError = '';
    this.editando = false;
  }

  ordenCampo: keyof Producto | '' = '';
  ordenAsc: boolean = true;

  ordenarPor(campo: keyof Producto) {
    if (this.ordenCampo === campo) {
      this.ordenAsc = !this.ordenAsc;
    } else {
      this.ordenCampo = campo;
      this.ordenAsc = true;
    }

    this.productos.sort((a, b) => {
      let valorA: any = a[campo];
      let valorB: any = b[campo];
      if (campo === 'fechaEntrega') {
        valorA = new Date(valorA);
        valorB = new Date(valorB);
      }
      return this.ordenAsc ? valorA < valorB ? -1 : 1 : valorA > valorB ? -1 : 1;
    });
  }

  getIconoOrden(campo: keyof Producto): string {
    if (this.ordenCampo !== campo) return 'bi bi-arrow-down-up text-muted';
    return this.ordenAsc ? 'bi bi-arrow-up text-primary' : 'bi bi-arrow-down text-primary';
  }

  validarCorreo(correo: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
  }

  editProduct(producto: Producto, content: any) {
    this.productoEditando = producto;
    this.nuevoProducto = { ...producto };
    this.openModal(content, true);
  }

  deleteProduct(producto: Producto): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar el producto "${producto.nombre}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then(result => {
      if (result.isConfirmed) {
        const index = this.productos.indexOf(producto);
        if (index !== -1) {
          this.productos.splice(index, 1);
          this.toastService.showToast(
            'Producto eliminado',
            `El producto "${producto.nombre}" fue eliminado.`,
            'danger'
          );
          this.ajustarPaginacion();
          this.cdr.detectChanges();
        }
      }
    });
  }  

  ajustarPaginacion(): void {
    const totalFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    ).length;
  
    const totalPaginas = Math.ceil(totalFiltrados / this.tamanioPagina);
  
    this.paginaActual = Math.min(this.paginaActual, totalPaginas || 1);
  }  

  cerrarModal(modal: any): void {
    this.resetFormulario();
    modal.dismiss();
  }

  ngAfterViewInit(): void {
    this.marcarScroll();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  }

  marcarScroll() {
    const contenedor = this.tablaScroll?.nativeElement;
    if (contenedor && contenedor.scrollWidth > contenedor.clientWidth) {
      contenedor.classList.add('scrollable');
    } else if (contenedor) {
      contenedor.classList.remove('scrollable');
    }
  }

  filtroNombre: string = '';

  get productosFiltrados(): Producto[] {
    return this.productos
      .filter(p => p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()))
      .slice(this.indiceInicio, this.indiceFin);
  }

  paginaActual: number = 1;
  tamanioPagina: number = 5;

  get totalPaginas(): number {
    return Math.ceil(
      this.productos.filter(p => p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())).length /
      this.tamanioPagina
    );
  }

  get indiceInicio(): number {
    return (this.paginaActual - 1) * this.tamanioPagina;
  }

  get indiceFin(): number {
    return this.paginaActual * this.tamanioPagina;
  }

  cambiarPagina(offset: number) {
    const nuevaPagina = this.paginaActual + offset;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  cerrarToast(id: number): void {
    this.toastService.dismiss(id);
  }

  getToastColor(type: 'success' | 'danger' | 'warning' | 'info'): string {
    switch (type) {
      case 'success': return '#198754';
      case 'danger': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'info':
      default: return '#0d6efd';
    }
  }

  getIconClass(type: 'success' | 'danger' | 'warning' | 'info'): string {
    switch (type) {
      case 'success': return 'bi bi-check-circle-fill';
      case 'danger': return 'bi bi-x-circle-fill';
      case 'warning': return 'bi bi-exclamation-triangle-fill';
      case 'info':
      default: return 'bi bi-info-circle-fill';
    }
  }

  getIconBgClass(type: 'success' | 'danger' | 'warning' | 'info'): string {
    switch (type) {
      case 'success': return 'bg-success';
      case 'danger': return 'bg-danger';
      case 'warning': return 'bg-warning text-dark';
      case 'info':
      default: return 'bg-primary';
    }
  }

  seleccionados: Set<number> = new Set();

  toggleSeleccionarTodos(checked: boolean): void {
    this.productosFiltrados.forEach(producto => {
      if (checked) {
        this.seleccionados.add(producto.id);
      } else {
        this.seleccionados.delete(producto.id);
      }
    });
  }

  estaSeleccionado(id: number): boolean {
    return this.seleccionados.has(id);
  }

  toggleSeleccion(id: number, checked: boolean): void {
    if (checked) {
      this.seleccionados.add(id);
    } else {
      this.seleccionados.delete(id);
    }
  }

  todosSeleccionadosEnPantalla(): boolean {
    return this.productosFiltrados.every(p => this.seleccionados.has(p.id));
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const isChecked = input.checked;

    this.productosFiltrados.forEach(producto => {
      if (isChecked) {
        this.seleccionados.add(producto.id);
      } else {
        this.seleccionados.delete(producto.id);
      }
    });
  }

  productosSeleccionadosPaginaActual(): Producto[] {
    return this.productosFiltrados.filter(p => this.seleccionados.has(p.id));
  }
  
  eliminarSeleccionadosPaginaActual(): void {
    const seleccionadosEnPagina = this.productosSeleccionadosPaginaActual();
    if (seleccionadosEnPagina.length === 0) return;
  
    Swal.fire({
      title: '¿Eliminar seleccionados?',
      text: `Se eliminarán ${seleccionadosEnPagina.length} productos de esta página.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d'
    }).then(result => {
      if (result.isConfirmed) {
        this.productos = this.productos.filter(p => !seleccionadosEnPagina.some(sel => sel.id === p.id));
        seleccionadosEnPagina.forEach(p => this.seleccionados.delete(p.id));
        this.toastService.showToast(
          'Productos eliminados',
          `${seleccionadosEnPagina.length} productos fueron eliminados.`,
          'danger'
        );
        this.ajustarPaginacion();
        this.cdr.detectChanges();
        this.marcarScroll();
      }
    });
  }  
}