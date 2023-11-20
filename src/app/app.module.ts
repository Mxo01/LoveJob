import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginPageComponent } from "./Components/login-page/login-page.component";
import { HomePageComponent } from "./Components/home-page/home-page.component";
import { SearchPageComponent } from "./Components/search-page/search-page.component";
import { ProfilePageComponent } from "./Components/profile-page/profile-page.component";
import { NavbarComponent } from "./Components/navbar/navbar.component";
import { FavoritesComponent } from "./Components/favorites/favorites.component";
import { ChatsComponent } from "./Components/chats/chats.component";
import { SelectLocationModalComponent } from "./Components/select-location-modal/select-location-modal.component";
import { GeosupportModalComponent } from "./Components/geosupport-modal/geosupport-modal.component";
import { SingleChatComponent } from "./Components/single-chat/single-chat.component";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { TokenInterceptor } from "./Interceptors/token.interceptor";
import { FeedbackPageComponent } from "./Components/feedback-page/feedback-page.component";
import { ResetPasswordComponent } from "./Components/reset-password/reset-password.component";

@NgModule({
	declarations: [
		AppComponent,
		LoginPageComponent,
		HomePageComponent,
		SearchPageComponent,
		ProfilePageComponent,
		NavbarComponent,
		FavoritesComponent,
		ChatsComponent,
		SelectLocationModalComponent,
		GeosupportModalComponent,
		SingleChatComponent,
		FeedbackPageComponent,
		ResetPasswordComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
