import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.0.2"
    id("io.spring.dependency-management") version "1.1.0"
    kotlin("jvm") version "1.7.22"
    kotlin("plugin.spring") version "1.7.22"
    kotlin("kapt") version "1.6.21"
    kotlin("plugin.allopen") version "1.6.21"
    kotlin("plugin.noarg") version "1.6.21"
}

group = "cz.uhk.mois"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_17

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    implementation("javax.persistence:javax.persistence-api")
    implementation("javax.persistence:javax.persistence-api:2.2")
    implementation("commons-lang:commons-lang:2.6")
    implementation("org.springdoc:springdoc-openapi-starter-webflux-ui:2.0.0")
    implementation("org.springframework.security:spring-security-config")
    implementation("org.springframework.security:spring-security-oauth2-client")
    implementation("org.springframework.cloud:spring-cloud-starter-netflix-eureka-client:4.0.0")

    //db
    runtimeOnly("org.postgresql:postgresql")
    runtimeOnly("org.postgresql:r2dbc-postgresql")

    //test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")

    implementation("org.mapstruct:mapstruct:1.5.2.Final")
    kapt("org.mapstruct:mapstruct-processor:1.5.2.Final")
}

kapt {
    generateStubs = false
    arguments {
        arg("mapstruct.unmappedTargetPolicy", "ignore")
    }
    keepJavacAnnotationProcessors = true
}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        freeCompilerArgs = listOf("-Xjsr305=strict")
        jvmTarget = "17"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}
