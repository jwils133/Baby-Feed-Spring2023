import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { QuestionnairePageComponent } from './pages/questionnaire-page/questionnaire-page.component';
import { QuestIdInputComponent } from './pages/quest-id-input-page/quest-id-input.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { ResearchPageComponent } from './pages/research-page/research-page.component';
import { ResearchQuestionnaireComponent } from './pages/research-questionnaire/research-questionnaire.component';
import { ResearchUsersComponent } from './pages/research-users/research-users.component';
import { ResearchHistoryComponent } from './pages/research-history/research-history.component';
import { FooditemComponent } from './pages/fooditem/fooditem.component';
import { QuestResultsComponent } from './pages/quest-results/quest-results.component';
import { RecommendComponent } from './pages/recommend/recommend.component';
import { ClinicalPortalComponent } from './pages/clinical-portal/clinical-portal.component';
import { AuthGuard } from './services/authentication/auth.guard';
import { RecommendParentalComponent } from './pages/recommend-parental/recommend-parental.component';
import { TrackerPageComponent } from './pages/tracker-page/tracker-page.component';
import { TrackerHistoryPageComponent } from './pages/tracker-history-page/tracker-history-page.component';
import { HistoryParentalComponent } from './pages/history-parental/history-parental.component';
import { LoginComponent } from './pages/login';
import { ClinicQuestResultsComponent } from './pages/clinic-quest-results';
import { ClinicRecommendComponent } from './pages/clinic-recommend';
import { AdminUsersComponent } from './pages/admin-users';
import { AdminResearchUsersComponent } from './pages/research-admin-users/research-admin-users.component';
import { AdminResearcherUserComponent } from './pages/admin-research-user/admin-research-user.component';
import { ParticipantUserComponent } from './pages/admin-participant/admin-participant.component';
import { ResearchInstitutionComponent } from './pages/research-institution/research-institution.component';
import { UserComponent } from './pages/user/user.component';
import { ClinicUserComponent } from './pages/clinic-user/clinic-user.component';
import { AdminClinicsComponent } from './pages/admin-clinics';
import { ClinicComponent } from './pages/clinic/clinic.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { ClinicTrackerHistoryComponent } from './pages/clinic-tracker-history/clinic-tracker-history.component';
import { ResearchQuestIdInputComponent } from './pages/researcher-quest-id-input-page/researcher-quest-id-input.component';
import { AdminTrackerHistoryComponent } from './pages/admin-tracker-history/admin-tracker-history.component';
import { ClinicalUsersComponent } from './pages/clinical-users';
import { ClinicNewUserComponent } from './pages/clinic-new-user/clinic-new-user.component';
import { ResearchNewUserComponent } from './pages/research-new-user/research-new-user.component';
import { UpdateResearchInstitutionComponent } from './pages/modify-research-institution/modify-research-institution.component';
import { UpdateResearcherComponent } from './pages/modify-researcher/modify-researcher.component';
import { ClinicQuestionnaireComponent } from './pages/clinic-questionnaire/clinic-questionnaire.component';
import { GrowthChartsPageComponent } from './pages/growth-charts-page/growth-charts-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/home',
    pathMatch: 'full'
  },
  {
    path: '*',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'admin/fooditem/:id',
    component: FooditemComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/fooditem',
    component: FooditemComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/user/:type/:id',
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/user/:id',
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/home',
    component: AdminPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/research/users',
    component: AdminResearchUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/research/institution',
    component: ResearchInstitutionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/research/institution/:id',
    component: UpdateResearchInstitutionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/researcher/user/:id',
    component: UpdateResearcherComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'admin/researcher',
    component: AdminResearcherUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/participant',
    component: ParticipantUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/results',
    component: QuestResultsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/recommend',
    component: RecommendComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/clinics',
    component: AdminClinicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/clinic',
    component: ClinicComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/clinic/:id',
    component: ClinicComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/tracker-history',
    component: AdminTrackerHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clinic/results',
    component: ClinicQuestResultsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clinic/recommend',
    component: ClinicRecommendComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clinic/questionnaire',
    component: ClinicQuestionnaireComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clinic/users',
    component: ClinicalUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clinic/user/:type/:id',
    component: ClinicUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clinic/user',
    component: ClinicUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clinic/user/:id',
    component: ClinicNewUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'researcher/user/:id',
    component: ResearchNewUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clinic/tracker-history',
    component: ClinicTrackerHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'clinic/home',
    component: ClinicalPortalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parent/questionnaire',
    component: QuestIdInputComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parent/questionnaire/:id',
    component: QuestionnairePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parent/growth-charts-page',
    component: GrowthChartsPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parent/home',
    component: HomePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parent/tracker',
    component: TrackerPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parent/tracker-history',
    component: TrackerHistoryPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parent/history',
    component: HistoryParentalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'parent/recommend',
    component: RecommendParentalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'researcher/home',
    component: ResearchUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'researcher/questionnaire',
    component: ResearchQuestionnaireComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'researcher/users',
    component: ResearchUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'researcher/history',
    component: ResearchHistoryComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'participant/home',
    component: ResearchQuestIdInputComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'participant/questionnaire/:id',
    component: QuestionnairePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
