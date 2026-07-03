package com.carbonaudit.carbonaudit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CarbonauditApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarbonauditApplication.class, args);
	}

}
