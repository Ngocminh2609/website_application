# Bước 1: Build ứng dụng bằng Maven với Java 23 (Amazon Corretto)
FROM maven:3.9.9-amazoncorretto-23 AS build
WORKDIR /app

# Copy file cấu hình pom.xml và tải dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy mã nguồn và đóng gói JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Bước 2: Chạy ứng dụng bằng JRE 23 (Amazon Corretto Alpine - gọn nhẹ)
FROM amazoncorretto:23-alpine
WORKDIR /app

# Copy file jar từ bước build sang
COPY --from=build /app/target/*.jar app.jar

# Mở port 8080 cho ứng dụng
EXPOSE 8080

# Chạy ứng dụng Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
