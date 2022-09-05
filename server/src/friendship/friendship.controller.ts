import { Body, Controller, Get, Param, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/2fa-jwt/jwt/jwt-auth.guard';
import { User } from 'src/user/user.decorator';
import { userParitalDto } from 'src/user/user.dto';
import { FriendshipService } from './friendship.service';

@Controller('friendship')
export class FriendshipController {
	constructor(private readonly friendshipService: FriendshipService) {}

	@Get('/friends')
	@UseGuards(JwtAuthGuard)
	async getFriends(@User() user: userParitalDto) {
		return await this.friendshipService.getFriends(user.login);
	}

	@Get('/pendings')
	@UseGuards(JwtAuthGuard)
	async getPendings(@User() user: userParitalDto) {
		return await this.friendshipService.getPendings(user.login);
	}

	@Get('/blocked')
	@UseGuards(JwtAuthGuard)
	async getBlocked(@User() user: userParitalDto) {
		return await this.friendshipService.getBlocked(user.login);
	}
}