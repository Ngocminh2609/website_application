package com.ecommerce.backend.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

import static com.ecommerce.backend.constant.security.KeycloakRoleConverterConstants.*;

public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    @SuppressWarnings("unchecked")
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Map<String, Object> realmAccess = (Map<String, Object>) jwt.getClaims().get(CLAIM_REALM_ACCESS);
        if (realmAccess == null || realmAccess.isEmpty()) {
            return Collections.emptyList();
        }

        Collection<String> roles = (Collection<String>) realmAccess.get(CLAIM_ROLES);
        if (roles == null) {
            return Collections.emptyList();
        }

        return roles.stream()
                .map(roleName -> new SimpleGrantedAuthority(ROLE_PREFIX + roleName))
                .collect(Collectors.toList());
    }
}
