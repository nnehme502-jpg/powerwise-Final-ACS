import { Inject, Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { PG_POOL } from '../database/database.module';
import { LoginDto, RegisterDto } from './dto';
@Injectable()
export class AuthService { constructor(@Inject(PG_POOL) private db:Pool, private jwt:JwtService){}
 async register(dto:RegisterDto){ const ex=await this.db.query('SELECT id FROM users WHERE email=$1',[dto.email]); if(ex.rowCount) throw new ConflictException('Email already exists'); const hash=await bcrypt.hash(dto.password,10); const r=await this.db.query('INSERT INTO users(full_name,email,password_hash) VALUES($1,$2,$3) RETURNING id,full_name,email,role,created_at',[dto.full_name,dto.email,hash]); return {user:r.rows[0]}; }
 async login(dto:LoginDto){ const r=await this.db.query('SELECT id,full_name,email,role,password_hash FROM users WHERE email=$1',[dto.email]); if(!r.rowCount) throw new UnauthorizedException('Invalid email or password'); const u=r.rows[0]; if(!await bcrypt.compare(dto.password,u.password_hash)) throw new UnauthorizedException('Invalid email or password'); const token=this.jwt.sign({id:u.id,email:u.email,role:u.role}); return {token,user:{id:u.id,full_name:u.full_name,email:u.email,role:u.role}}; }
}
