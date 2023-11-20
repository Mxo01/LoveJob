import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DefaultService } from "src/app/Services/default.service";
import { User } from "src/app/Models/user.model";
import { Router } from "@angular/router";
import { APIService } from "src/app/Services/api.service";
import Swal from "sweetalert2";
import { Subscription } from "rxjs";

@Component({
	selector: "app-profile-page",
	templateUrl: "./profile-page.component.html",
	styleUrls: ["./profile-page.component.css"],
})
export class ProfilePageComponent implements OnInit {
	@Input() currentUser: User | undefined;
	@Output() updateUser = new EventEmitter<User>();

	getUserSubscription: Subscription = new Subscription();
	getRoleSubscription: Subscription = new Subscription();

	firstName: string = "";
	lastName: string = "";
	email: string = "";
	password: string = "";
	username: string = "";
	positionCompany: string = "";

	editPassword: boolean = false;
	firstNameRO: boolean = true;
	lastNameRO: boolean = true;
	emailRO: boolean = true;
	positionOrCompanyRO: boolean = true;

	role: string = "";

	constructor(
		private service: DefaultService,
		private apiService: APIService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.getRoleSubscription = this.service.roleObs.subscribe({
			next: (role: string) => {
				const roleFromToken = this.service.getRoleFromToken();
				this.role = role || roleFromToken;
			},
		});

		document.addEventListener("keydown", e => {
			if (e.key === "Escape") {
				this.firstNameRO = true;
				this.lastNameRO = true;
				this.emailRO = true;
				this.editPassword = false;
				this.positionOrCompanyRO = true;
				this.firstName = "";
				this.lastName = "";
				this.email = "";
				this.password = "";
				this.positionCompany = "";
			}
		});
	}

	ngOnDestroy(): void {
		this.getUserSubscription.unsubscribe();
		this.getRoleSubscription.unsubscribe();
	}

	setFirstName(e: Event): void {
		this.firstName = (e.target as HTMLInputElement).value;
	}

	setLastName(e: Event): void {
		this.lastName = (e.target as HTMLInputElement).value;
	}

	setEmail(e: Event): void {
		this.email = (e.target as HTMLInputElement).value;
	}

	setPassword(e: Event): void {
		this.password = (e.target as HTMLInputElement).value;
	}

	setUsername(e: Event): void {
		this.username = (e.target as HTMLInputElement).value;
	}

	setPositionCompany(e: Event): void {
		this.positionCompany = (e.target as HTMLInputElement).value;
	}

	hiddenPassword(): string {
		const password = this.currentUser?.password;
		if (password) return [...password].map(() => "*").join("");

		return "";
	}

	editFN(): void {
		this.firstNameRO = !this.firstNameRO;
		this.lastNameRO = true;
		this.emailRO = true;
		this.editPassword = false;
		this.positionOrCompanyRO = true;
	}

	confirmEditFN(): void {
		const user: User = {
			firstName: this.firstName,
			lastName: this.currentUser!.lastName,
			email: this.currentUser!.email,
			password: this.currentUser!.password,
			username: this.currentUser!.username,
			companyName: this.currentUser!.companyName,
			position: this.currentUser!.position,
			role: this.role,
		};

		this.updateUser.emit(user);

		this.apiService.editUser(this.currentUser!.username, user).subscribe();
		this.firstNameRO = !this.firstNameRO;
	}

	editLN(): void {
		this.lastNameRO = !this.lastNameRO;
		this.firstNameRO = true;
		this.emailRO = true;
		this.editPassword = false;
		this.positionOrCompanyRO = true;
	}

	confirmEditLN(): void {
		const user: User = {
			firstName: this.currentUser!.firstName,
			lastName: this.lastName,
			email: this.currentUser!.email,
			password: this.currentUser!.password,
			username: this.currentUser!.username,
			companyName: this.currentUser!.companyName,
			position: this.currentUser!.position,
			role: this.role,
		};

		this.updateUser.emit(user);

		this.apiService.editUser(this.currentUser!.username, user).subscribe();
		this.lastNameRO = !this.lastNameRO;
	}

	editEmail(): void {
		this.emailRO = !this.emailRO;
		this.firstNameRO = true;
		this.lastNameRO = true;
		this.editPassword = false;
		this.positionOrCompanyRO = true;
	}

	confirmEditEmail(): void {
		const user: User = {
			firstName: this.currentUser!.firstName,
			lastName: this.currentUser!.lastName,
			email: this.email,
			password: this.currentUser!.password,
			username: this.currentUser!.username,
			companyName: this.currentUser!.companyName,
			position: this.currentUser!.position,
			role: this.role,
		};

		this.updateUser.emit(user);

		this.apiService.editUser(this.currentUser!.username, user).subscribe();
		this.emailRO = !this.emailRO;
	}

	setEditPassword(): void {
		this.editPassword = !this.editPassword;
		this.firstNameRO = true;
		this.lastNameRO = true;
		this.emailRO = true;
		this.positionOrCompanyRO = true;
	}

	confirmEditPassword(): void {
		const user: User = {
			firstName: this.currentUser!.firstName,
			lastName: this.currentUser!.lastName,
			email: this.currentUser!.email,
			password: this.password,
			username: this.currentUser!.username,
			companyName: this.currentUser!.companyName,
			position: this.currentUser!.position,
			token: "pwd",
			role: this.role,
		};

		this.updateUser.emit(user);

		this.apiService.editUser(this.currentUser!.username, user).subscribe();
		this.editPassword = !this.editPassword;
	}

	editPC(): void {
		this.positionOrCompanyRO = !this.positionOrCompanyRO;
		this.firstNameRO = true;
		this.lastNameRO = true;
		this.emailRO = true;
		this.editPassword = false;
	}

	confirmEditPC(): void {
		const user: User = {
			firstName: this.currentUser!.firstName,
			lastName: this.currentUser!.lastName,
			email: this.currentUser!.email,
			password: this.currentUser!.password,
			username: this.currentUser!.username,
			companyName:
				this.currentUser!.position === null
					? this.positionCompany
					: this.currentUser!.companyName,
			position:
				this.currentUser!.position === null
					? this.currentUser!.position
					: this.positionCompany,
			role: this.role,
		};

		this.updateUser.emit(user);

		this.apiService.editUser(this.currentUser!.username, user).subscribe();
		this.positionOrCompanyRO = !this.positionOrCompanyRO;
	}

	logOut(): void {
		this.service.logout();
	}

	deleteAccount(): void {
		Swal.fire({
			icon: "info",
			title: "Are you sure?",
			text: "You will not be able to recover your account!",
			background: "#212529",
			color: "#fff",
			confirmButtonText: "Yes, delete it!",
			confirmButtonColor: "#bb2d3b",
			showCancelButton: true,
			cancelButtonColor: "#6c757d",
			cancelButtonText: "No, keep it",
			focusCancel: false,
		}).then(result => {
			if (result.isConfirmed) {
				this.apiService
					.deleteUser(this.currentUser!.username)
					.subscribe({
						next: () => {
							this.apiService
								.deleteMarkersByUsername(
									this.currentUser!.username
								)
								.subscribe({
									next: () => {
										this.apiService
											.deleteFavoritesByUsername(
												this.currentUser!.username
											)
											.subscribe({
												next: () => {
													localStorage.clear();
													this.router
														.navigate([""])
														.then(() =>
															window.location.reload()
														);
												},
											});
									},
								});
						},
						error: () => {
							Swal.fire({
								icon: "error",
								title: "Oops...",
								text: "Something went wrong!",
								background: "#212529",
								color: "#fff",
								confirmButtonColor: "#6c757d",
							});
						},
					});
			}
		});
	}
}
