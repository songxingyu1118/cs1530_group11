package com.example.cs1530.repository;

import com.example.cs1530.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT ")
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}