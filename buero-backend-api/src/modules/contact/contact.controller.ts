import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { ContactService } from "./contact.service";
import { CreateContactDto } from "./dto/create-contact.dto";

@ApiTags("contact")
@Controller("contact")
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiOperation({
    summary: "Submit contact / support form",
    description:
      "Sends the request to the Büro.de inbox and a confirmation email to the user.",
  })
  @ApiResponse({ status: 200, description: "Emails queued/sent" })
  @ApiResponse({ status: 400, description: "Validation error" })
  @ApiResponse({ status: 503, description: "Mail service unavailable" })
  async create(@Body() dto: CreateContactDto) {
    return this.contactService.submit(dto);
  }
}
