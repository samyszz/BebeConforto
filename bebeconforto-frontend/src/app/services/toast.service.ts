import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private toastr: ToastrService) {}

  sucesso(msg: string) { this.toastr.success(msg, 'Sucesso!'); }
  erro(msg: string) { this.toastr.error(msg, 'Ops!'); }
  info(msg: string) { this.toastr.info(msg); }
}