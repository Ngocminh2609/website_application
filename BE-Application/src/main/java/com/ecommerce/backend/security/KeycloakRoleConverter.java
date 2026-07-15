package com.ecommerce.backend.security;

import com.ecommerce.backend.util.security.JwtClaimUtil;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.stream.Collectors;

import static com.ecommerce.backend.constant.security.KeycloakRoleConverterConstants.ROLE_PREFIX;

public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        return JwtClaimUtil.extractRealmRoles(jwt).stream()
                .map(roleName -> new SimpleGrantedAuthority(ROLE_PREFIX + roleName))
                .collect(Collectors.toList());
    }
}
