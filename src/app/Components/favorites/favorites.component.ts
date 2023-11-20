import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Favorite } from "src/app/Models/favorite.model";
import { APIService } from "src/app/Services/api.service";
import Swal from "sweetalert2";

@Component({
	selector: "app-favorites",
	templateUrl: "./favorites.component.html",
	styleUrls: ["./favorites.component.css"],
})
export class FavoritesComponent {
	@Input() favorites: Favorite[] = [];
	@Output() updateFavorites = new EventEmitter<Favorite[]>();

	constructor(private apiService: APIService) {}

	removeFavorite(id: string): void {
		Swal.fire({
			icon: "info",
			title: "Are you sure?",
			text: "You will not be able to recover this favorite!",
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
				this.favorites = this.favorites.filter(fav => fav.id !== id);
				this.updateFavorites.emit(this.favorites);
				this.apiService.deleteFavorite(id).subscribe();
			}
		});
	}
}
