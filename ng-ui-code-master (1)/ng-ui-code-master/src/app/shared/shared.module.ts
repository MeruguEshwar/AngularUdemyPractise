import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ToastModule,
  DropdownModule,
  TableModule,
  TabViewModule,
  AutoCompleteModule,
  InputTextModule,
  InputTextareaModule,
  PaginatorModule,
  ButtonModule,
  DialogModule,
  ConfirmDialogModule,
  ChartModule,
  ProgressSpinnerModule,
  CheckboxModule,
  CalendarModule,
  InputSwitchModule,
  ChipsModule,
  DragDropModule,
  SelectButtonModule,
  InputMaskModule,
  TooltipModule,
  FileUploadModule,
  InputNumberModule,
  TimelineModule,
  MultiSelectModule,
  PickListModule,
  TreeTableModule,
} from "@app/components/public_api";
import { MessagesModule } from "@app/components/public_api";
import { MessageModule } from "@app/components/public_api";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { DisplayStatus } from "./pipes/status.pipe";
import { MinuteSecondsPipe } from "./pipes/minute-seconds.pipe";
import { SafePipe } from "./pipes/safe.pipe";
import { MarkUpColorDirective } from "./directives/mark-upred.directive";
import { EqualValidatorDirective } from "./directives/equal-validator.directive";
@NgModule({
  declarations: [
    DisplayStatus,
    MinuteSecondsPipe,
    SafePipe,
    MarkUpColorDirective,
    EqualValidatorDirective,
  ],
  imports: [CommonModule],
  exports: [
    ToastModule,
    MessagesModule,
    MessageModule,
    AutoCompleteModule,
    DropdownModule,
    TableModule,
    CheckboxModule,
    CalendarModule,
    InputTextModule,
    InputNumberModule,
    PaginatorModule,
    PickListModule,
    ButtonModule,
    DialogModule,
    ConfirmDialogModule,
    ChartModule,
    ReactiveFormsModule,
    FormsModule,
    ProgressSpinnerModule,
    InputTextareaModule,
    TabViewModule,
    InputSwitchModule,
    ChipsModule,
    TooltipModule,
    DragDropModule,
    SelectButtonModule,
    FileUploadModule,
    InputMaskModule,
    TreeTableModule,
    DisplayStatus,
    MinuteSecondsPipe,
    SafePipe,
    TimelineModule,
    MultiSelectModule,
    EqualValidatorDirective,
  ],
  providers: [],
})
export class SharedServiceModule {}
