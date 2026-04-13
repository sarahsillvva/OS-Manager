export class CreateOrderDTO {
  equipment!: string;
  description!: string;
  userEmail!: string; 
  technicianId!: string;
  details?: Record<string, any>;
}