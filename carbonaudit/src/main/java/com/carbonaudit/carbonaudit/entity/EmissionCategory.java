package com.carbonaudit.carbonaudit.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="emission_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmissionCategory {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long categoryId;

    private String categoryName;
}