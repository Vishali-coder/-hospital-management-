package com.hospital.booking.util;

import java.util.Base64;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * Utility class for generating JWT secret keys
 * This class can be used to generate secure keys for JWT token signing
 */
public class JwtKeyGenerator {
    
    /**
     * Generates a secure Base64-encoded secret key for HS256 algorithm
     * @return Base64-encoded secret key
     */
    public static String generateSecureKey() {
        return Base64.getEncoder().encodeToString(
            Keys.secretKeyFor(SignatureAlgorithm.HS256).getEncoded()
        );
    }
    
    /**
     * Main method to generate and print a new JWT secret key
     * Run this method when you need to generate a new secret key
     */
    public static void main(String[] args) {
        System.out.println("Generated JWT Secret Key (Base64 encoded):");
        System.out.println(generateSecureKey());
        System.out.println("\nAdd this to your application.properties file:");
        System.out.println("jwt.secret=" + generateSecureKey());
    }
}