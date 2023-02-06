import { BrowserModule } from "@angular/platform-browser";
import { LOCALE_ID, NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { QuestIdInputComponent } from "./pages/quest-id-input-page/quest-id-input.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { QuestionnairePageComponent } from "./pages/questionnaire-page/questionnaire-page.component";
import { ErrorDialogPopupComponent } from "./components/error-dialog-popup/error-dialog-popup.component";
import { TextCardComponent } from "./components/text-card/text-card.component";
import { QuestionBlockComponent } from "./components/question-block/question-block.component";
import { FormsModule } from "@angular/forms";
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
  HttpClient,
} from "@angular/common/http";
import { ResultsPageComponent } from "./pages/results-page/results-page.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AdminPageComponent } from "./pages/admin-page/admin-page.component";
import { FooditemComponent } from "./pages/fooditem/fooditem.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AdminHeaderComponent } from "./pages/admin-header/admin-header.component";
import { ResearchHeaderComponent } from "./pages/research-header/research-header.component";
import { QuestResultsComponent } from "./pages/quest-results/quest-results.component";
import { RecommendComponent } from "./pages/recommend/recommend.component";
import { PopupComponent } from "./components/popup/popup.component";
import { DeletePopupComponent } from "./components/delete-popup/delete-popup.component";
import { FlashMessagesModule } from "angular2-flash-messages";
import { RecommendModalComponent } from "./components/recommend-modal/recommend-modal.component";
import { FoodRecommendModalComponent } from "./components/food-recommend-modal/food-recommend-modal.component";
import { FoodItemsTableComponent } from "./components/food-items-table/food-items-table.component";
import { ClinicalPortalComponent } from "./pages/clinical-portal/clinical-portal.component";
import { ClinicalHeaderComponent } from "./pages/clinical-header/clinical-header.component";
import { ParentalHeaderComponent } from "./pages/parental-header/parental-header.component";
import { ResearchParentalHeaderComponent } from "./pages/research-parental-header/research-parental-header.component";
import { RecommendParentalComponent } from "./pages/recommend-parental/recommend-parental.component";
import { TrackerPageComponent } from "./pages/tracker-page/tracker-page.component";
import { TrackerBlockComponent } from "./components/tracker-block/tracker-block.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { TrackerHistoryPageComponent } from "./pages/tracker-history-page/tracker-history-page.component";
import { HistoryParentalComponent } from "./pages/history-parental/history-parental.component";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { LoginComponent } from "./pages/login";
import { LoginHeaderComponent } from "./pages/login-header";
import { ClinicQuestResultsComponent } from "./pages/clinic-quest-results";
import { ClinicRecommendComponent } from "./pages/clinic-recommend";
import { AdminUsersComponent } from "./pages/admin-users";
import { AdminResearchUsersComponent } from "./pages/research-admin-users/research-admin-users.component";
import { ParticipantUserComponent } from "./pages/admin-participant/admin-participant.component";
import { UserComponent } from "./pages/user/user.component";
import { ClinicUserComponent } from "./pages/clinic-user/clinic-user.component";
import { AdminClinicsComponent } from "./pages/admin-clinics/";
import { ClinicComponent } from "./pages/clinic/clinic.component";
import { LogoutComponent } from "./pages/logout/logout.component";
import { ClinicianPipe } from "./pipes/clinicianFilter.pipe";
import { ParentPipe } from "./pipes/parentFilter.pipe";
import { PatientPipe } from "./pipes/patientFilter.pipe";
import { SearchPipe } from "./pipes/searchFilter.pipe";
import { ResultsPipe } from "./pipes/resultsFilter.pipe";
import { ClinicTrackerHistoryComponent } from "./pages/clinic-tracker-history/clinic-tracker-history.component";
import { TrackerFilterPipe } from "./pipes/tracker-filter.pipe";
import { RecommendedFilterPipe } from "./pipes/recommended-filter.pipe";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { LoaderComponent } from "./components/loader/loader.component";
import { LoaderInterceptorService } from "./services/loader/loader-interceptor.service";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { ResearchPageComponent } from "./pages/research-page/research-page.component";
import { ResearchQuestionnaireComponent } from "./pages/research-questionnaire/research-questionnaire.component";
import { ResearchUsersComponent } from "./pages/research-users/research-users.component";
import { ResearchQuestIdInputComponent } from "./pages/researcher-quest-id-input-page/researcher-quest-id-input.component";
import { CreateParticipantModalComponent } from "./components/create-participant-modal/create-participant-modal.component";
import { ResearchHistoryComponent } from "./pages/research-history/research-history.component";
import { ResearchInstitutionComponent } from "./pages/research-institution/research-institution.component";
import { AdminResearcherUserComponent } from "./pages/admin-research-user/admin-research-user.component";
import { AdminTrackerHistoryComponent } from "./pages/admin-tracker-history/admin-tracker-history.component";
import { ResultRoundPipe } from "./pipes/result-round.pipe";
import { ClinicalUsersComponent } from "./pages/clinical-users";
import { ClinicNewUserComponent } from "./pages/clinic-new-user/clinic-new-user.component";
import { ClinicQuestionnaireComponent } from "./pages/clinic-questionnaire/clinic-questionnaire.component";
import { ResearchNewUserComponent } from "./pages/research-new-user/research-new-user.component";
import { Angular2CsvModule } from "angular2-csv";
import { UpdateResearchInstitutionComponent } from "./pages/modify-research-institution/modify-research-institution.component";
import { UpdateResearcherComponent } from "./pages/modify-researcher/modify-researcher.component";
import {
  TranslateModule,
  TranslateLoader,
  TranslateCompiler,
} from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
// import ngx-translate-messageformat-compiler
import { TranslateMessageFormatCompiler } from "ngx-translate-messageformat-compiler";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { FeedingFrequencyComponent } from "./components/feeding-frequency/feeding-frequency.component";
import { MatTableModule } from "@angular/material/table";
import { GrowthChartsPageComponent } from "./pages/growth-charts-page/growth-charts-page.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { ServingSizePicturesComponent } from "./components/serving-size-pictures/serving-size-pictures.component";
import { InterpretationGrowthChartsDialogComponent } from "./components/interpretation-growth-charts-dialog/interpretation-growth-charts-dialog.component";
import { GrowthChartsHelpComponent } from "./components/growth-charts-help/growth-charts-help.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HomePageComponent } from "./pages/home-page/home-page.component";

@NgModule({
  declarations: [
    AppComponent,
    QuestIdInputComponent,
    QuestionnairePageComponent,
    ErrorDialogPopupComponent,
    TextCardComponent,
    QuestionBlockComponent,
    ResultsPageComponent,
    AdminPageComponent,
    FooditemComponent,
    AdminHeaderComponent,
    ResearchHeaderComponent,
    ResearchUsersComponent,
    ResearchPageComponent,
    ResearchQuestionnaireComponent,
    ResearchQuestIdInputComponent,
    AdminResearchUsersComponent,
    ParticipantUserComponent,
    ResearchHistoryComponent,
    QuestResultsComponent,
    RecommendComponent,
    ResearchInstitutionComponent,
    AdminResearcherUserComponent,
    PopupComponent,
    RecommendModalComponent,
    FoodRecommendModalComponent,
    FoodItemsTableComponent,
    ClinicalPortalComponent,
    ClinicalHeaderComponent,
    ClinicalUsersComponent,
    ClinicNewUserComponent,
    ParentalHeaderComponent,
    ResearchParentalHeaderComponent,
    RecommendParentalComponent,
    UpdateResearchInstitutionComponent,
    UpdateResearcherComponent,
    TrackerPageComponent,
    TrackerBlockComponent,
    TrackerHistoryPageComponent,
    HistoryParentalComponent,
    LoginComponent,
    LoginHeaderComponent,
    ClinicQuestResultsComponent,
    ClinicRecommendComponent,
    AdminUsersComponent,
    UserComponent,
    ClinicUserComponent,
    AdminClinicsComponent,
    ClinicComponent,
    LogoutComponent,
    ClinicianPipe,
    ParentPipe,
    PatientPipe,
    SearchPipe,
    ResultsPipe,
    DeletePopupComponent,
    ClinicTrackerHistoryComponent,
    TrackerFilterPipe,
    RecommendedFilterPipe,
    LoaderComponent,
    CreateParticipantModalComponent,
    AdminTrackerHistoryComponent,
    ResultRoundPipe,
    ResearchNewUserComponent,
    ClinicQuestionnaireComponent,
    FeedingFrequencyComponent,
    ServingSizePicturesComponent,
    GrowthChartsPageComponent,
    InterpretationGrowthChartsDialogComponent,
    GrowthChartsHelpComponent,
    HomePageComponent
  ],
  imports: [
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    NgxChartsModule,
    MatTableModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    FlashMessagesModule.forRoot(),
    MatProgressBarModule,
    DragDropModule,
    BrowserModule,
    Angular2CsvModule,
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      // compiler configuration
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
    }),
    NgIdleKeepaliveModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorDialogPopupComponent,
    ResultsPageComponent,
    PopupComponent,
    RecommendModalComponent,
    FoodRecommendModalComponent,
    DeletePopupComponent,
    CreateParticipantModalComponent,
    FeedingFrequencyComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true,
    },
  ],
})
export class AppModule {}
// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
