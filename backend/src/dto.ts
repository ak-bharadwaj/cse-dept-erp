import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  rollNumber!: string;

  @IsString()
  @IsNotEmpty()
  batch!: string;

  @IsString()
  @IsNotEmpty()
  section!: string;

  @IsString()
  @IsNotEmpty()
  guardianName!: string;

  @IsString()
  @IsOptional()
  password?: string;
}

export class CreateFacultyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsString()
  @IsNotEmpty()
  officialEmail!: string;

  @IsString()
  @IsNotEmpty()
  qualification!: string;

  @IsNumber()
  @Min(0)
  experience!: number;

  @IsNumber()
  @Min(0)
  workload!: number;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsString()
  @IsOptional()
  joiningDate?: string;

  @IsString()
  @IsOptional()
  employmentType?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(1)
  semester!: number;
}

export class CreateAllocationDto {
  @IsNumber()
  facultyId!: number;

  @IsNumber()
  subjectId!: number;

  @IsString()
  @IsNotEmpty()
  section!: string;
}

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  maxMarks!: string;

  @IsString()
  @IsOptional()
  passingMarks?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  subjectId!: number;
}

export class CreateResearchDto {
  @IsNumber()
  facultyId!: number;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  details!: string;
}

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  visibility?: string;
}
