import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, of } from 'rxjs';
import { SettingService } from 'src/app/services/setting.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
})
export class SettingComponent implements OnInit {
  constructor(
    private settingService: SettingService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  selectedFileLogo: File | null = null;
  selectedFileBanner: File | null = null;
  selectedFileAboutImage: File | null = null;

  ngOnInit(): void {
    this.createForm();
    this.settingService.getSetting().subscribe((data) => {
      this.openingHour = data.opening_hour;
      this.createOpeningHourControls();
      this.settingForm.patchValue(data);
    });
  }

  isFormSubmitted = false;
  openingHour: any;

  settingForm!: FormGroup;

  createForm(): void {
    this.settingForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      short_description: ['', [Validators.required]],
      logo: [''],
      banner: [''],
      opening_hour: this.fb.group({}), // Inicializar como um FormGroup vazio
    });
  }

  createOpeningHourControls(): void {
    const openingHourControl = this.settingForm.get('opening_hour') as FormGroup; // é seguro assumir que isto é um FormGroup
    for (const day in this.openingHour) {
      if (Object.prototype.hasOwnProperty.call(this.openingHour, day)) {
        openingHourControl.addControl(day, this.fb.control('')); // adicionar um FormControl para cada dia
      }
    }
  }

  getOpeningHourKeys(): string[] {
    return Object.keys(this.openingHour);
  }

  onSubmit(): void {
    if (this.settingForm.valid) {
      this.isFormSubmitted = true;

      const formData = new FormData();
      const settingData = this.settingForm.getRawValue();

      Object.keys(settingData).forEach((key) => {
        if (key !== 'logo' && key !== 'banner') {
          if (key === 'opening_hour') {
            const openingHour = settingData[key];
            Object.keys(openingHour).forEach((day) => {
              formData.append(`opening_hour[${day}]`, openingHour[day]);
            });
          } else {
            formData.append(key, settingData[key]);
          }
        }
      });

      if (this.selectedFileLogo) {
        formData.append('imagelogo', this.selectedFileLogo);
      }

      if (this.selectedFileBanner) {
        formData.append('imagebanner', this.selectedFileBanner);
      }

      if (this.selectedFileAboutImage) {
        formData.append('imageabout', this.selectedFileAboutImage);
      }
      this.settingService
        .updateSetting(formData)
        .pipe(
          finalize(() => (this.isFormSubmitted = false)),
          catchError((err) => {
            this.toastr.error('Não foi possível editar produto', err.error.message);
            return of();
          })
        )
        .subscribe({
          next: () => {
            this.router.navigate(['index']);
            this.toastr.success('Produto editado com sucesso!');
          },
        });
    } else {
      this.toastr.error('Por favor, preencha o formulário corretamente.');
    }
  }

  onBack(): void {
    this.router.navigate(['index']);
  }

  onFileChangeLogo(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFileLogo = event.target.files[0];
    }
  }

  onFileChangeAboutImage(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFileAboutImage = event.target.files[0];
    }
  }

  onFileChangeBanner(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFileBanner = event.target.files[0];
    }
  }
}
