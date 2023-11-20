import { Component, Input } from "@angular/core";
import { Chat } from "src/app/Models/chat.model";

@Component({
	selector: "app-single-chat",
	templateUrl: "./single-chat.component.html",
	styleUrls: ["./single-chat.component.css"],
})
export class SingleChatComponent {
	@Input() chat: Chat = {
		id: "",
		user1: "",
		name1: "",
		user2: "",
		name2: "",
		lastMessage: "",
		time: new Date(),
	};

	constructor() {}
}
