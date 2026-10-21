--
-- PostgreSQL database dump
--

\restrict eeChpWiQsbAjawduLyXjGTn9UfxQxITcPlFDpFg2XC9NahqjQypOmFzdUndJaF4

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: f_unaccent(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.f_unaccent(text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $_$
                SELECT public.unaccent($1);
                $_$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activities (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    target_audience character varying(255) NOT NULL,
    unit character varying(255),
    user_id uuid,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: activity_participant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_participant (
    activity_id uuid NOT NULL,
    participant_id uuid NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: attendances; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendances (
    id uuid NOT NULL,
    activity_id uuid NOT NULL,
    participant_id uuid NOT NULL,
    date date NOT NULL,
    is_present boolean DEFAULT false NOT NULL,
    observation text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);


--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);


--
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    category character varying(255) NOT NULL,
    file_path character varying(255) NOT NULL,
    file_original_name character varying(255) NOT NULL,
    file_type character varying(10) NOT NULL,
    is_published boolean DEFAULT false NOT NULL,
    published_at timestamp(0) without time zone,
    user_id uuid NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.failed_jobs (
    id uuid NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id uuid NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: participant_authorizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant_authorizations (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    can_leave_alone boolean DEFAULT false NOT NULL,
    authorized_name character varying(255),
    authorized_bond character varying(255),
    authorized_phone character varying(255),
    document_path character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: participant_family_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant_family_members (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    relationship character varying(255),
    age integer,
    profession character varying(255),
    income bigint DEFAULT '0'::bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: participant_filiations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant_filiations (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    mother_name character varying(255),
    mother_phone character varying(255),
    mother_workplace character varying(255),
    father_name character varying(255),
    father_phone character varying(255),
    father_workplace character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: participant_guardians; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant_guardians (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    name character varying(255),
    relationship character varying(255),
    phone character varying(255),
    workplace character varying(255),
    address character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: participant_health; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant_health (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    has_health_issue boolean DEFAULT false NOT NULL,
    health_issue_description text,
    has_disability boolean DEFAULT false NOT NULL,
    disability_description character varying(255),
    has_medicine_allergy boolean DEFAULT false NOT NULL,
    medicine_allergy_description character varying(255),
    has_food_intolerance boolean DEFAULT false NOT NULL,
    food_intolerance_description character varying(255),
    has_regular_medicine boolean DEFAULT false NOT NULL,
    regular_medicine_description character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: participant_housings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant_housings (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    property_type character varying(255),
    property_type_other character varying(255),
    rent_value integer,
    has_running_water boolean DEFAULT false NOT NULL,
    has_sewage boolean DEFAULT false NOT NULL,
    has_electricity boolean DEFAULT false NOT NULL,
    nis character varying(255),
    has_benefits boolean DEFAULT false NOT NULL,
    benefits_description character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: participant_observations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant_observations (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    notes text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: participant_schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participant_schools (
    id uuid NOT NULL,
    participant_id uuid NOT NULL,
    school_name character varying(255),
    period character varying(255),
    grade character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participants (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    cpf character varying(14),
    rg character varying(255),
    photo_path character varying(255),
    birth_date date NOT NULL,
    phone character varying(255),
    address character varying(255),
    unit character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id uuid,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'professor'::character varying NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    deleted_at timestamp(0) without time zone
);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activities (id, name, description, target_audience, unit, user_id, created_at, updated_at, deleted_at) FROM stdin;
019e46fd-e253-70f6-a58f-57dc10296c86	Grupo de Adolescentes	\N	criancas	Espaço Esperança	019e46f6-45c7-70df-96fb-c790c4e0325c	2026-05-20 17:05:04	2026-05-20 17:05:04	\N
019dd037-5f35-721b-84d4-4fcf78edaaaf	Bordado	Oficina de bordado em toalhas e panos de prato	idosos	Espaço Real	\N	2026-04-27 15:33:03	2026-06-08 15:08:31	2026-06-08 15:08:31
019dd037-5f3b-7057-9628-569ecc88f187	Crochê	Aulas de crochê	idosos	Espaço Real	\N	2026-04-27 15:33:03	2026-06-08 15:08:36	2026-06-08 15:08:36
019dd037-5f4c-710c-a606-57db6e547873	Pintura em Tecido	Oficina de pintura artística	idosos	Espaço Real	\N	2026-04-27 15:33:03	2026-06-08 15:08:50	2026-06-08 15:08:50
019dd037-5f47-70a3-b803-98b0125b0f22	Musicalização	Oficina de música e instrumentos	criancas	Espaço Esperança	\N	2026-04-27 15:33:03	2026-06-08 15:08:56	2026-06-08 15:08:56
019dd037-5f41-7143-815e-a4278c46ad5e	Educação Cidadã	Rodas de conversa e educação cidadã	ambos	Espaço Esperança	\N	2026-04-27 15:33:03	2026-06-08 15:09:06	2026-06-08 15:09:06
019dd037-5f3f-720e-a16d-79252616cf15	Culinária Infantil	Oficina de culinária para crianças	criancas	Espaço Esperança	\N	2026-04-27 15:33:03	2026-06-08 15:09:14	2026-06-08 15:09:14
019dd037-5f38-70e8-a76f-cda3990fa2ab	Brinquedoteca	Espaço de brincadeiras e recreação	criancas	Espaço Esperança	\N	2026-04-27 15:33:03	2026-06-08 15:09:18	2026-06-08 15:09:18
019dd037-5f44-7299-bcd2-0f72089a1b2e	Jiu-Jitsu	Aulas de artes marciais	criancas	Espaço Esperança	019f23c2-64a9-7205-8667-a9e2a54077b5	2026-04-27 15:33:03	2026-07-02 14:36:03	\N
019dd037-5f2d-7108-a5ea-6e5596a9e177	SCFV Mulheres	Criação de peças artesanais	idosos	Espaço Real	019f23ba-3287-73e8-bbc9-ecb0fb1f941b	2026-04-27 15:33:03	2026-07-02 14:36:12	\N
019dd037-5f4f-730f-8b11-384dcc902bd2	Tênis de Mesa	Aulas de tênis de mesa para desenvolvimento esportivo	criancas	Espaço Esperança	019f23c3-d572-7085-8a97-53590d6b4f19	2026-04-27 15:33:03	2026-07-02 14:36:19	\N
\.


--
-- Data for Name: activity_participant; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_participant (activity_id, participant_id, created_at, updated_at) FROM stdin;
019dd037-5f44-7299-bcd2-0f72089a1b2e	019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	2026-05-20 16:52:10	2026-05-20 16:52:10
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-06-08 13:37:55	2026-06-08 13:37:55
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-06-08 13:39:55	2026-06-08 13:39:55
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-06-08 13:42:07	2026-06-08 13:42:07
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-06-08 13:42:25	2026-06-08 13:42:25
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-06-08 13:45:13	2026-06-08 13:45:13
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-06-08 13:47:18	2026-06-08 13:47:18
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-06-08 13:49:46	2026-06-08 13:49:46
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-06-08 13:51:57	2026-06-08 13:51:57
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-06-08 13:54:31	2026-06-08 13:54:31
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-06-08 13:56:35	2026-06-08 13:56:35
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-06-08 13:59:52	2026-06-08 13:59:52
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-06-08 14:07:57	2026-06-08 14:07:57
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-06-08 14:08:21	2026-06-08 14:08:21
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-06-08 14:10:45	2026-06-08 14:10:45
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-06-08 14:12:30	2026-06-08 14:12:30
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-06-08 14:14:04	2026-06-08 14:14:04
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-06-08 14:17:09	2026-06-08 14:17:09
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-06-08 14:20:37	2026-06-08 14:20:37
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-06-08 14:23:06	2026-06-08 14:23:06
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-06-08 14:25:29	2026-06-08 14:25:29
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-06-08 14:34:08	2026-06-08 14:34:08
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-06-08 14:38:22	2026-06-08 14:38:22
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-06-08 14:57:02	2026-06-08 14:57:02
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-06-08 14:58:28	2026-06-08 14:58:28
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-06-08 15:00:48	2026-06-08 15:00:48
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-06-08 15:02:58	2026-06-08 15:02:58
019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-06-08 15:04:37	2026-06-08 15:04:37
019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-06-25 15:00:20	2026-06-25 15:00:20
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23cf-d26e-72e4-a177-4aa236ea8020	2026-07-02 14:10:50	2026-07-02 14:10:50
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23d2-0f65-72c1-b310-f08055930c63	2026-07-02 14:13:16	2026-07-02 14:13:16
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23d4-b33e-7017-9c6c-1e52905168dc	2026-07-02 14:16:09	2026-07-02 14:16:09
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23d6-29ab-73f7-ae5f-6bb340ad0b01	2026-07-02 14:17:45	2026-07-02 14:17:45
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23d8-78d0-72c9-bbce-9977a6845797	2026-07-02 14:20:17	2026-07-02 14:20:17
019dd037-5f4f-730f-8b11-384dcc902bd2	019f23d8-78d0-72c9-bbce-9977a6845797	2026-07-02 14:20:17	2026-07-02 14:20:17
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23da-5b6b-7138-a534-7bd65a738ab9	2026-07-02 14:22:20	2026-07-02 14:22:20
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23dc-1445-72de-8c78-c1b27fa4987f	2026-07-02 14:24:13	2026-07-02 14:24:13
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23dd-dccd-7011-82e6-090a2eb2f684	2026-07-02 14:26:10	2026-07-02 14:26:10
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23df-7a16-71c4-972a-55fa6cd94199	2026-07-02 14:27:56	2026-07-02 14:27:56
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23e1-9a76-73e7-975b-b6f978a9ef40	2026-07-02 14:30:15	2026-07-02 14:30:15
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23e3-21b9-702d-9b9b-2ad7c4316d7d	2026-07-02 14:31:55	2026-07-02 14:31:55
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23e5-db97-72a5-8029-abfa9f328ed5	2026-07-02 14:34:54	2026-07-02 14:34:54
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23ed-0ff6-71cf-a6ca-fe8b37735aa2	2026-07-02 14:42:46	2026-07-02 14:42:46
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23ef-12f2-73d4-8239-258c964bd778	2026-07-02 14:44:58	2026-07-02 14:44:58
019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-07-02 14:48:52	2026-07-02 14:48:52
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23f4-b7da-7012-890b-794942d0af42	2026-07-02 14:51:08	2026-07-02 14:51:08
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23f6-281b-73cd-b1d0-420531076382	2026-07-02 14:52:42	2026-07-02 14:52:42
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23fc-69f6-72f2-a0de-0cd9261fd295	2026-07-02 14:59:32	2026-07-02 14:59:32
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23fe-aac7-7165-88a1-789edb82ede3	2026-07-02 15:02:00	2026-07-02 15:02:00
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2404-7939-7034-931f-46ad4c880cd9	2026-07-02 15:08:20	2026-07-02 15:08:20
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2406-03ca-731e-b4e7-d959d8162ccb	2026-07-02 15:10:01	2026-07-02 15:10:01
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2408-7937-7124-9e26-c742ab05af5f	2026-07-02 15:12:42	2026-07-02 15:12:42
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f240a-74af-73dd-857a-149822fe001b	2026-07-02 15:14:52	2026-07-02 15:14:52
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f240d-c80e-72b7-b56f-ef5b303a29aa	2026-07-02 15:18:30	2026-07-02 15:18:30
019dd037-5f4f-730f-8b11-384dcc902bd2	019f240d-c80e-72b7-b56f-ef5b303a29aa	2026-07-02 15:18:30	2026-07-02 15:18:30
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f240e-f987-7154-9fd2-ee9f250e384b	2026-07-02 15:19:49	2026-07-02 15:19:49
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f241c-e4e8-713d-9331-4cb794c1a10c	2026-07-02 15:35:01	2026-07-02 15:35:01
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f241f-9dcf-703f-a8cc-82faa1c4a5a7	2026-07-02 15:37:59	2026-07-02 15:37:59
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2421-7c56-7289-8831-099c868282db	2026-07-02 15:40:02	2026-07-02 15:40:02
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2423-afe8-7058-a7dd-f11789ebd598	2026-07-02 15:42:26	2026-07-02 15:42:26
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2425-4a62-71b3-9f4d-fd22768cfc12	2026-07-02 15:44:11	2026-07-02 15:44:11
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2426-976a-73bc-8feb-fb033192f832	2026-07-02 15:45:36	2026-07-02 15:45:36
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2427-8730-713b-aa9b-320ce0d3342e	2026-07-02 15:46:38	2026-07-02 15:46:38
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2428-cf58-72cb-9d4d-5d4b255c329f	2026-07-02 15:48:02	2026-07-02 15:48:02
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2429-89ad-716b-b1ec-3fbdb7f96ba2	2026-07-02 15:48:49	2026-07-02 15:48:49
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f242a-f86f-70ff-9c6e-c80dc9a3ef76	2026-07-02 15:50:23	2026-07-02 15:50:23
019dd037-5f4f-730f-8b11-384dcc902bd2	019f242d-9652-70eb-b7f5-9d6ed25bdce3	2026-07-02 15:53:15	2026-07-02 15:53:15
019dd037-5f4f-730f-8b11-384dcc902bd2	019f242f-282a-7079-a7d7-a80727513a91	2026-07-02 15:54:58	2026-07-02 15:54:58
019dd037-5f4f-730f-8b11-384dcc902bd2	019f2430-b0a5-7168-99e2-09976a758ec7	2026-07-02 15:56:38	2026-07-02 15:56:38
019dd037-5f4f-730f-8b11-384dcc902bd2	019f2433-82e1-72dd-b6b4-8bc045fd7576	2026-07-02 15:59:43	2026-07-02 15:59:43
019dd037-5f4f-730f-8b11-384dcc902bd2	019f2434-6f67-7332-8c69-ace3defb4a53	2026-07-02 16:00:44	2026-07-02 16:00:44
019dd037-5f4f-730f-8b11-384dcc902bd2	019f2435-80b5-70be-ab51-c221666b406e	2026-07-02 16:01:54	2026-07-02 16:01:54
019dd037-5f4f-730f-8b11-384dcc902bd2	019f2436-fefc-7357-950c-f69baadedaef	2026-07-02 16:03:31	2026-07-02 16:03:31
019dd037-5f4f-730f-8b11-384dcc902bd2	019f2438-0e60-7065-958b-8abb179113aa	2026-07-02 16:04:41	2026-07-02 16:04:41
019dd037-5f4f-730f-8b11-384dcc902bd2	019f2439-2956-72a4-9af9-146653403346	2026-07-02 16:05:53	2026-07-02 16:05:53
019dd037-5f4f-730f-8b11-384dcc902bd2	019f243a-58b2-733b-b14a-c57263f12319	2026-07-02 16:07:11	2026-07-02 16:07:11
019dd037-5f4f-730f-8b11-384dcc902bd2	019f243b-6e89-71a8-aeb0-a23061a21981	2026-07-02 16:08:22	2026-07-02 16:08:22
019dd037-5f4f-730f-8b11-384dcc902bd2	019f243c-5459-7395-85e8-00bdb60348d5	2026-07-02 16:09:21	2026-07-02 16:09:21
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f243e-7cf8-729a-8105-6fc7c7eeb656	2026-07-02 16:11:42	2026-07-02 16:11:42
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f243f-b46d-737f-b478-99d82ec8f5c0	2026-07-02 16:13:02	2026-07-02 16:13:02
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f246e-b89c-7370-9d32-c18d1f44ed20	2026-07-02 17:04:23	2026-07-02 17:04:23
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f248e-baa6-7148-9db4-d3d468da4a95	2026-07-02 17:39:21	2026-07-02 17:39:21
019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2495-d8be-7284-a9d4-1e72bda0ca2d	2026-07-02 17:47:08	2026-07-02 17:47:08
019dd037-5f4f-730f-8b11-384dcc902bd2	019f298b-dd42-72da-a454-ba7943289e0c	2026-07-03 16:57:28	2026-07-03 16:57:28
019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-07-06 14:38:14	2026-07-06 14:38:14
019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-08-03 14:35:11	2026-08-03 14:35:11
019dd037-5f4f-730f-8b11-384dcc902bd2	019fdd22-e121-7093-8603-1c5da640d3b9	2026-08-07 13:51:18	2026-08-07 13:51:18
019e46fd-e253-70f6-a58f-57dc10296c86	01a0166a-0339-700d-9eb9-519b80b05c1b	2026-08-18 16:47:21	2026-08-18 16:47:21
019dd037-5f44-7299-bcd2-0f72089a1b2e	01a0166a-0339-700d-9eb9-519b80b05c1b	2026-08-18 16:47:21	2026-08-18 16:47:21
019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-08-24 14:05:19	2026-08-24 14:05:19
019dd037-5f44-7299-bcd2-0f72089a1b2e	01a0443f-8330-7233-ad2d-ade67d6262d5	2026-08-27 14:23:28	2026-08-27 14:23:28
019dd037-5f44-7299-bcd2-0f72089a1b2e	01a04445-f3c5-7234-baad-000c79bc9a6b	2026-08-27 14:30:30	2026-08-27 14:30:30
019dd037-5f44-7299-bcd2-0f72089a1b2e	01a04451-046d-725f-a23c-fad397c4b95c	2026-08-27 14:42:35	2026-08-27 14:42:35
019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-08-27 16:06:10	2026-08-27 16:06:10
019dd037-5f4f-730f-8b11-384dcc902bd2	01a0b563-5427-723a-812a-0f175368a841	2026-09-18 13:39:40	2026-09-18 13:39:40
019dd037-5f44-7299-bcd2-0f72089a1b2e	01a0d954-e883-720d-b7ea-3e68db80d027	2026-09-25 13:10:15	2026-09-25 13:10:15
019dd037-5f4f-730f-8b11-384dcc902bd2	01a0da50-2002-7370-87c4-2a6b32841190	2026-09-25 17:44:39	2026-09-25 17:44:39
019e46fd-e253-70f6-a58f-57dc10296c86	01a0da50-2002-7370-87c4-2a6b32841190	2026-09-25 17:44:39	2026-09-25 17:44:39
019dd037-5f4f-730f-8b11-384dcc902bd2	01a10dc0-d890-73a0-9107-98fd25a324ef	2026-10-05 17:28:24	2026-10-05 17:28:24
019e46fd-e253-70f6-a58f-57dc10296c86	01a10dc0-d890-73a0-9107-98fd25a324ef	2026-10-05 17:28:24	2026-10-05 17:28:24
019dd037-5f4f-730f-8b11-384dcc902bd2	01a12207-d572-7227-a89e-9f11da7b3920	2026-10-09 15:58:21	2026-10-09 15:58:21
019e46fd-e253-70f6-a58f-57dc10296c86	01a12207-d572-7227-a89e-9f11da7b3920	2026-10-09 15:58:21	2026-10-09 15:58:21
019dd037-5f44-7299-bcd2-0f72089a1b2e	01a13673-e182-70e4-b8d5-b9832d4783ca	2026-10-13 15:19:26	2026-10-13 15:19:26
019dd037-5f4f-730f-8b11-384dcc902bd2	01a155ae-66e2-718d-bbe7-f70fac829f36	2026-10-19 16:40:55	2026-10-19 16:40:55
019e46fd-e253-70f6-a58f-57dc10296c86	01a155ae-66e2-718d-bbe7-f70fac829f36	2026-10-19 16:40:55	2026-10-19 16:40:55
\.


--
-- Data for Name: attendances; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendances (id, activity_id, participant_id, date, is_present, observation, created_at, updated_at, deleted_at) FROM stdin;
019e46f9-9cae-72bc-91f3-3ae6fbaaa5d9	019dd037-5f44-7299-bcd2-0f72089a1b2e	019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	2026-05-20	t	\N	2026-05-20 17:00:24	2026-05-20 17:00:24	\N
019f23cc-6d40-73d1-8735-f6eb16e03b58	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-07-02	f	\N	2026-07-02 14:07:07	2026-07-02 14:07:07	\N
019f23cc-6d42-71eb-944b-07ee7c4466fe	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-07-02	f	\N	2026-07-02 14:07:07	2026-07-02 14:07:07	\N
019f23cc-6d45-72e4-8449-c51c4bc24500	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-07-02	f	\N	2026-07-02 14:07:07	2026-07-02 14:07:07	\N
019f23cc-6d51-7011-bb6d-a4180a6f9e44	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-07-02	f	\N	2026-07-02 14:07:07	2026-07-02 14:07:07	\N
019f23cc-6d53-702f-b67c-2c2e65f67fcd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-07-02	f	\N	2026-07-02 14:07:07	2026-07-02 14:07:07	\N
019f23cc-6d55-7003-8c2c-4ba1e94bd17e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-07-02	f	\N	2026-07-02 14:07:07	2026-07-02 14:07:07	\N
019f23cc-6d59-72bc-8482-efda299d0e35	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-07-02	f	\N	2026-07-02 14:07:07	2026-07-02 14:07:07	\N
019f23cc-6d5c-7357-9087-da45857b3767	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-07-02	f	\N	2026-07-02 14:07:07	2026-07-02 14:07:07	\N
019f23cc-6d61-7284-82e8-a3fca2d50900	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-07-02	f	\N	2026-07-02 14:07:07	2026-07-02 14:07:07	\N
019f23cc-6d34-70f6-ab33-d27e84f200ba	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d3c-7181-bab8-a091e52b2f50	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d3e-73d7-b8ec-5cc164c743ed	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d47-7243-9206-03b0790d231e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d49-720d-a901-a647eb3e9d27	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d4b-72fc-b15c-06c236aa9148	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d4d-7364-b04e-6879aa2fc3ce	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d4f-71f7-a2d2-da664ecc2914	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d57-71ff-a7e0-8318c9bfd3ac	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d5e-7250-aca8-ef8b898f908e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d60-7295-b183-11424fd3fa55	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d63-7315-b1ec-644e61cedc25	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d65-7327-a1aa-5d0fa6f457c0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d67-73b8-bd07-f993536a8177	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d68-701e-9164-07f8319c292b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d6a-7151-80b9-cf658578daf5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d6c-700d-a78e-1008875cf2f7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d6e-7329-b4bc-f1ac9e040fb7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23cc-6d70-738c-aa36-1aeccd0ace11	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-07-02	t	\N	2026-07-02 14:07:07	2026-07-02 14:42:29	\N
019f23ff-dfee-73c5-8d05-05a4fd7d73ae	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-07-02	t	\N	2026-07-02 15:03:19	2026-07-02 15:03:19	\N
019f2495-0c29-72a9-b0e2-3b49748d1860	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23cf-d26e-72e4-a177-4aa236ea8020	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c2e-726a-9adc-45d5c5746baf	019dd037-5f44-7299-bcd2-0f72089a1b2e	019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c30-7319-aac5-7741a2452975	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23d2-0f65-72c1-b310-f08055930c63	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c33-7210-afce-dc3db4c60762	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23d4-b33e-7017-9c6c-1e52905168dc	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c35-7255-9d34-e9941deecb83	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23d6-29ab-73f7-ae5f-6bb340ad0b01	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c38-70bd-b31b-2e085e7f8403	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23d8-78d0-72c9-bbce-9977a6845797	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c3a-7253-8876-07a48838b6ed	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23da-5b6b-7138-a534-7bd65a738ab9	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c3b-71e1-9503-08cb10945337	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23dc-1445-72de-8c78-c1b27fa4987f	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c3d-709a-a735-a54c9057aa26	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23dd-dccd-7011-82e6-090a2eb2f684	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c3e-73a8-b17c-1c096f883453	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23df-7a16-71c4-972a-55fa6cd94199	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c40-70d6-b4bb-927b074df7bd	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23e1-9a76-73e7-975b-b6f978a9ef40	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c41-7271-84b8-f4e1b4cce9cf	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23e3-21b9-702d-9b9b-2ad7c4316d7d	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c43-720e-b472-a97f886bba40	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23e5-db97-72a5-8029-abfa9f328ed5	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c45-71c1-8865-78138ed1ad7b	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23ed-0ff6-71cf-a6ca-fe8b37735aa2	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c46-7020-94e2-c8df6d5abeb1	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23ef-12f2-73d4-8239-258c964bd778	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c4f-7035-b8b7-1652406576c0	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23f4-b7da-7012-890b-794942d0af42	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c51-72e8-a6bc-62fb86465f3f	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23f6-281b-73cd-b1d0-420531076382	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c53-7043-a02f-19d2fbd0b7ef	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23fc-69f6-72f2-a0de-0cd9261fd295	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c54-7381-8d1b-d82f6b5448f3	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f23fe-aac7-7165-88a1-789edb82ede3	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c56-739c-970e-0ce5317b0371	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2404-7939-7034-931f-46ad4c880cd9	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c58-716e-947a-88cb2fd2999f	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2406-03ca-731e-b4e7-d959d8162ccb	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c5a-73f3-ae4d-08cc90c80ed8	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2408-7937-7124-9e26-c742ab05af5f	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c5b-71af-ba44-dc947dba8014	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f240a-74af-73dd-857a-149822fe001b	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c5d-70f4-86a6-aae7d43433f4	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f240d-c80e-72b7-b56f-ef5b303a29aa	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c5e-7198-8e2c-28a7dbc6d650	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f240e-f987-7154-9fd2-ee9f250e384b	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c60-71fa-a2ee-1c8eeb12f6a2	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f241c-e4e8-713d-9331-4cb794c1a10c	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c62-7355-9a76-dc85fccbcd99	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f241f-9dcf-703f-a8cc-82faa1c4a5a7	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c63-7183-8a9d-56341d2b2e11	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2421-7c56-7289-8831-099c868282db	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c65-725c-9ac1-cc8a450d6244	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2423-afe8-7058-a7dd-f11789ebd598	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c67-7229-b898-bcc69d7e936d	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2425-4a62-71b3-9f4d-fd22768cfc12	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c68-727e-adfe-242666a0cdf9	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2426-976a-73bc-8feb-fb033192f832	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c6a-7180-8cad-46e8e2f54c13	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2427-8730-713b-aa9b-320ce0d3342e	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c6b-7215-b3c9-3d6a76528eec	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2428-cf58-72cb-9d4d-5d4b255c329f	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c6d-725b-9a63-c0adaeaa77ad	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2429-89ad-716b-b1ec-3fbdb7f96ba2	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c6f-71d5-a69e-c1f727e6b563	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f242a-f86f-70ff-9c6e-c80dc9a3ef76	2026-07-02	f	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c70-72a1-9994-52d06a32f5c8	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f243e-7cf8-729a-8105-6fc7c7eeb656	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c72-7122-a914-ee703312d313	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f243f-b46d-737f-b478-99d82ec8f5c0	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-0c74-70dc-8339-73bbb54873f1	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f246e-b89c-7370-9d32-c18d1f44ed20	2026-07-02	t	\N	2026-07-02 17:46:15	2026-07-02 17:46:15	\N
019f2495-68c3-710c-bfec-d130ffd765e0	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f248e-baa6-7148-9db4-d3d468da4a95	2026-07-02	t	\N	2026-07-02 17:46:39	2026-07-02 17:46:39	\N
019f2496-3546-7373-aa61-4fe7edab4f58	019dd037-5f44-7299-bcd2-0f72089a1b2e	019f2495-d8be-7284-a9d4-1e72bda0ca2d	2026-07-02	t	\N	2026-07-02 17:47:31	2026-07-02 17:47:31	\N
019f387c-7f3b-7281-936b-790923491061	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-07-06	f	\N	2026-07-06 14:31:50	2026-07-06 14:31:50	\N
019f387c-7f5d-73d4-b0f1-aab61047b92b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f66-739a-aef5-09e48057dadb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f6c-7014-979a-e6a8edf1ec41	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f71-70c8-a86e-429302fcb541	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f7f-72b4-962d-929ee4962ff4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f83-715f-ab35-cc243a5ee4d0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f86-7210-bfe5-711ea78d32c0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f8a-710b-951f-093c5fc262b7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f8d-7305-afec-18bdfb1db8f5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f90-71be-8f89-5b279a927791	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f94-7085-8826-8a0ff2cf220c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f9a-71b8-bb1a-a66c277bcf4c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7f9f-70ee-9b14-2a09790f3d2a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fa1-71b8-8e04-af9eca66bae4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fa4-719d-81c4-1fe58b2066d9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fa7-7246-a59e-fa047670e78f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fab-7110-bdea-109e06ad311a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fad-71f1-bb6c-b3844433cf7f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7faf-7218-96f9-bec149188593	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fb2-7123-9ae6-4cb3b4017e3d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fb5-73d8-b506-e232e3242a7c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fb7-70fa-b0a4-47e5c38b6526	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fb9-7130-9dd4-551aca854cf9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fbc-731c-bfa3-1929389227ac	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fc0-73c6-99ef-2610bdcdd30e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fc3-734d-bd78-6dcf3828bcea	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-07-06	t	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fc5-7223-8ee3-9499c6dfc83b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f387c-7fc7-71f4-8f73-85966585a641	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-07-06	f	\N	2026-07-06 14:31:51	2026-07-06 14:31:51	\N
019f5c4f-a859-725f-a90e-5d6f1c4d960c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a869-70eb-aba6-65b4d2a79fd7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a86b-7378-a914-b7f7eda7be57	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a86d-71be-a124-b306a5692860	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a86f-72bb-a0e6-e501cba59ffd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a871-726b-a21f-2e04774e3e2a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a874-733d-8e76-60f5a16e3c97	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a876-70da-ab9b-0abb60fc710e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a879-71f2-b350-a65b62bbb74b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a87b-705a-91c4-4d987bbea625	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a87d-73bb-a365-4b0d64135adf	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a87f-72d2-852b-ad64b2770d3f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a881-72ba-acba-78b1ce493983	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a883-70b1-9b39-6c655ab056a0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a885-71b8-a4fd-4af7129aad65	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a887-718d-8262-9c01ccba5702	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a889-72e3-be6c-3ece486efc72	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a88b-7175-af6f-453446ded994	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a88d-710a-bda2-504d78897788	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a88f-7255-a0c2-9bfbee9c0095	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a891-73c7-90c2-cb97bcfb6d3e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a894-71a3-bd77-eeee69c527fb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a895-70b9-8518-e47d56e8dad3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a898-70f4-bd5d-51df3e2ea15f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a89b-726f-a8f6-8a2f6386197e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a89d-72ea-81b9-3f1589130294	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a89f-73cc-a5ef-5b3943f41b71	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a8a1-7380-bb94-6ebc5acfc526	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a8a3-70aa-b6bd-fb00ed10c970	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:12	\N
019f5c4f-a8a5-712e-96a8-a80069bb9beb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-07-09	f	\N	2026-07-13 13:29:12	2026-07-13 13:29:28	\N
019f5c50-3802-70d0-99f7-c5377abbade1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-07-06	t	\N	2026-07-13 13:29:48	2026-07-13 13:29:48	\N
019f5c51-079c-73b0-83d3-e9c1a1967781	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07a0-73e3-a0e6-8836936490f9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07a2-7032-a045-170d1f91951a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07a4-736a-9272-4e5b11f09d1e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07a6-724d-8aeb-5ff463bc99a8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07a9-70af-93ea-070991daaf04	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07ab-7122-89a1-e4405e80aea1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07af-728c-b9f1-debe2afe7fd8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07b5-70b1-8dd7-87ef5ba1353c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07b7-73a6-8b26-3204e0e664d3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07b8-738d-bf3a-19736fc7c731	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07ba-724d-b072-7a2c26b27a2c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07be-71c3-8271-c895688eb7c1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07c0-7003-9c5d-16d0990a8460	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07c2-720a-969f-67c037efaf25	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-07-13	t	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07c4-7103-9d20-3371743c6c70	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07c7-72cd-af35-d4d9df8798cb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07c8-73e6-a4cd-f1a59080f26a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07ca-7213-9ff9-debc37287a60	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07cc-730f-937a-4403c0362ed4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07ce-730a-9532-8d6cf425d709	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-07-13	t	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07d2-7005-9d0c-a8e314f14dc0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-07-13	t	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07d6-72f0-9f08-43ba7f1668c3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-07-13	f	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c51-07d8-73b1-92b4-8f8fa82b72b6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-07-13	t	\N	2026-07-13 13:30:42	2026-07-13 13:30:42	\N
019f5c58-b8f8-7082-8d21-ab76954ddded	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-07-02	t	\N	2026-07-13 13:39:06	2026-07-13 13:39:06	\N
019f5c5b-3564-73b7-807c-23c943037e74	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3566-70b7-879c-8b4bc0b50f5e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3569-728c-b764-fb1f9d46bbaf	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-356a-71e2-a635-f4b1bc180a35	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-356c-7234-86db-307cb958af46	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-356e-7268-bbed-351a38405875	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3570-716e-93ce-b51ae45d8092	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3571-715e-8f6a-b599d0bd381f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3573-70f5-a2db-665463a097f4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3575-7236-a183-ff071809968f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3576-7081-85a2-7c88c3485ce2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3578-7281-8474-62d01a17097a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-357b-70c9-b208-6da055b0784f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-357c-71ff-b0f0-9eb733864c9c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-357e-70f1-9f8d-f56cf09d61a8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3580-7353-b807-006fae1b2830	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3582-702a-b9f3-86bd6f34d910	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3583-70c5-a902-be4c94deac2b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3585-7394-8e50-9f9de8c5a985	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3587-7256-b922-5a3cbd0eca24	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3589-715b-aed7-86b9fc37e0b6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-358b-700e-8b6c-4855c10a74da	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-358d-7241-b236-442f108ce6be	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-358f-73d7-a93f-c949d9867147	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3590-72e8-92be-603e4f3bf157	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3592-7132-bf71-1fb7051453f7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3594-71fe-a474-c47a2ab59f87	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3596-7240-ac85-6d05b98321ce	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-3598-7397-83e1-25f896a82cab	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-06-01	f	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c5b-359a-70ae-b08b-7fac62e75668	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-06-01	t	\N	2026-07-13 13:41:49	2026-07-13 13:41:49	\N
019f5c66-a032-73df-9e64-7a9d1b7c359d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a035-728f-b605-c29bcafefe30	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a037-7310-a6b2-fc63e02817dd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a03a-718b-8c01-f3ea92e4d2e7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a03b-73d2-a67a-d741a04943db	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a03d-7313-af25-b469e8311777	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a03f-73fa-a014-9ee7b6ce5d19	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a041-71f9-b468-ecbb06a7aeb1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a042-7078-8ad5-3df5a228b3f0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a044-73f2-9a35-d4c13ff27a6e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a047-71e9-9b6f-ba36f4c66249	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a048-71b3-866c-580fa238f9b2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a04a-718e-a70b-bad93ff6e56d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a04c-730e-a05e-9be7e2226ea2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a04e-73fc-bf8c-5387b659cbb4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a050-71bf-9cf0-af618eb1830c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a053-7135-a716-262d7dc2f39a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a055-7026-9d64-6cd2d06a7065	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a057-730a-8f97-3c3caff0375a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a059-732a-8bf5-1b9d35a69893	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a05b-7229-9631-53e42e61af08	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a05d-703f-8aff-e2e6a2707edd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-06-08	t	O	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a05f-7297-9b65-e3c859fffd5a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a061-73ca-9da6-8c8a389b89c5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a064-73ce-b300-27eae27fb51d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a066-70cc-8741-1ddf9865a881	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a068-72c5-9c46-2a811af9c2c9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a06a-7256-af95-11965cb7e2a0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a06c-704b-bfd7-6f42fae88402	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-06-08	f	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c66-a06e-7373-8330-93142c343677	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-06-08	t	\N	2026-07-13 13:54:17	2026-07-13 13:54:17	\N
019f5c69-f4de-7183-8a91-5bb9894e91e2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-06-11	f	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f4e5-7160-abd5-1fbaf80b562e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f4ea-70e1-b198-1d0104b74443	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f4ef-73d4-b0ec-577cb95f1dc4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-06-11	f	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f4f3-72af-a2e7-898605a6d399	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f4f7-70f4-b709-0adff7eba740	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-06-11	f	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f4fc-722a-8771-3d3f4b03e558	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f501-7181-8445-931613409434	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f504-723f-830d-7036def46e35	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f509-7395-bf05-696561826aa5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f50d-73da-b0e7-199e1abf5445	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f511-70e6-9950-7fc9dd12bbf4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f516-72df-baa6-afc830f95278	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f519-7263-af52-43f0de68e76a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-06-11	f	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f51d-722b-a0af-9253dcee025e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f520-7071-8677-581702ce10dd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f523-70f3-97a0-596f4b332dfc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-06-11	f	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f527-72fe-ac7a-d024145f383c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f52b-70ac-8a49-ca836aebddae	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f52f-7129-9732-ae5f182529fa	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-06-11	f	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f533-7051-b376-06bfa1759bd8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f538-719c-ab63-8b87259bd608	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f53b-726f-819a-ccca9687adba	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-06-11	f	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f540-7200-9d2e-2d62132eeafe	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f543-7221-9a79-97b81fdb10e4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f548-7016-b4ca-17f652ea8ef3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f54c-7132-a613-d6ea4092b0bb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f550-72db-8ebb-ffde31c9b9b3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f553-73f1-8c4f-fff98104a9dc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c69-f557-7250-b63f-1e7cea20eaba	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-06-11	t	\N	2026-07-13 13:57:55	2026-07-13 13:57:55	\N
019f5c6e-c414-70e6-9eab-8d047d230139	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c417-7050-a9f4-fcdbff19b031	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c419-7311-85ec-e420f61b7202	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c41b-7345-9114-c619fd42ba56	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c41c-73e7-8ebd-06f19f77d09f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c41e-7285-ba68-8412b137349c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c420-7029-8922-d78111b45c6e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c422-73cb-8dde-5a1b57524751	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c423-70de-bae0-5ceab1d41667	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c425-70cf-b759-3f92a5d3276f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c427-72be-9b3a-0f3a8c7aefa1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c429-70e0-b39c-590aca643441	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c42b-729d-8c0a-3460cb694d0c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c42d-73c2-b690-0ec44a548384	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c42e-709e-94f6-97aeeebb877f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c430-7021-a19c-1fdc6ea42a14	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c431-73dc-aa0c-be0e231ee7a3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c433-72e9-89a9-778d0af8ecc4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c435-7158-832e-ba8f24fbaec6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c437-72cc-b764-1b34e21d9b73	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c438-73a2-a228-7e3dec4b9046	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c43a-727b-b555-c00ffa957f76	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c43c-7072-90bd-e78682afd85d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c43e-73bd-9a85-43c562728d8d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c43f-7169-9d72-d048c1190255	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c441-72db-b1fa-a3afeda458d7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c443-73fb-94c1-e89fe8679dc6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c445-70a9-ab98-b20da7d5d012	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-06-15	t	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c446-73bb-8f1f-68e41c121473	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c6e-c448-70d0-b950-4e04d9874fd6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-06-15	f	\N	2026-07-13 14:03:10	2026-07-13 14:03:10	\N
019f5c71-81b3-70a6-b29b-a0d0b5e21d96	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81b6-71fc-a086-7bac059a046d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81b8-7242-89a5-4337804fce34	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81ba-7335-8b72-939652dfb13a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81bc-71b2-8300-e0d0084bd9f4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81be-71f8-b682-c77f17cb1a9b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81c0-716c-afeb-a7c91e2f6c4b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81c2-738d-ae7f-22b5cb07f922	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81c4-724a-a321-4877019bcc7b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81c6-73cd-86be-f31ca2c98e0d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81c8-7082-9f6e-16cbb5f881a3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81cd-7237-82c3-5271c49729a5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81cf-70f8-ac72-e172265234d5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81d0-73b4-a38a-b2276f3f5565	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81d2-7297-ad92-034bc94cfe00	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81d4-711b-8a67-070d4dbf3cbf	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81d6-723f-8d9b-e188ce507567	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81d8-7203-b252-00b81de9126e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81d9-71c1-b40b-d2750c72bcf5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81db-72d4-8bac-5988bc83a4f8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81dd-70f8-b5b6-76b4876e56f7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81de-7135-8d3c-e51a2f66a9de	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81e0-706b-809e-39f45e543689	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81e1-73c9-b9d6-7e61e86c477c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81e3-72ed-87e0-7ddfc2f3f76e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81e4-7171-bb1a-4ee454db7825	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81e6-71b7-a53d-fc989d9c4d23	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81e8-70f5-81ff-ea9821c83ff5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-06-18	f	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81e9-71ca-b3f0-60d4ab781844	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c71-81eb-705d-b6c4-03fbc358f777	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-06-18	t	\N	2026-07-13 14:06:10	2026-07-13 14:06:10	\N
019f5c73-d73d-72b6-aacd-a4c1e80bdb7b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d740-7007-919b-059d74ab3fe6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d742-73a6-bed6-9202e8b2397f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d744-70ce-97e0-6feca712bd81	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d746-73a8-8669-f9d0f884fcff	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d748-71e0-9e69-6fd69e4b9569	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d74a-715e-b629-3fecba02dac4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d74c-7242-95f6-9410cddd98b9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d74e-70dd-8362-de1fa2a51017	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d750-723b-b737-aa9abff300c2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d752-711a-919f-666a6190ffc8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d754-70df-b2f1-b155abffb741	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d755-72a3-8a85-819a99296ad9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d757-7088-a6ba-1c02ae8064f5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d758-708f-a73c-d50a05c914c8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d75a-7130-bbe1-aea4b82d7874	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d75c-72e3-a323-08ea8e7f1d39	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d75d-705b-b0ef-44b6edf37e40	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d75f-7343-b717-af20f00145bf	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d761-7078-880b-37dfba51d1e3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d763-729f-a638-13b5d5f4e60a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d764-732e-accf-77ad36249cc8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d766-721d-a9fd-a4252fe8cdce	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d767-7012-bcf5-90bae486c1b9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d769-70ba-8312-f27ab3660091	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d76b-7204-92fe-f4dfce78146d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-06-22	f	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d76c-722f-87a8-0ee3b004136b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d76e-70ac-9d47-5ea84942c7a4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d76f-706f-a1b2-81551ee85f76	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c73-d771-704d-be55-ee1e3ba1288d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-06-22	t	\N	2026-07-13 14:08:43	2026-07-13 14:08:43	\N
019f5c75-c829-704b-8684-3022baa04196	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c82c-70fd-8357-f58f2e239454	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c82e-721f-9a15-c507747f6c23	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c830-7235-b3e6-87c98d78abb5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c832-7358-a772-b658c83ae95f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c835-73ac-acaf-8e6ec7cfef2c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c836-7238-af48-0cacc5474a8b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c838-7017-b595-101db0707796	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c83a-729f-833e-57a93ad28a80	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c83b-73ce-9095-61c002d30411	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c83d-70c2-9632-1d198c295fed	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c83f-70e8-94db-ee78040ea9e1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c841-734a-a36e-69625464b56b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c843-7220-aba2-b2c65bef5ef6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c845-73d3-ae56-a4a41b29ab14	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c847-7322-a9db-acf218ef26b1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c849-7375-ae4c-d149597b17eb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c84a-700d-a857-6060b4be2955	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c84c-715b-8c88-60b6352f563e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c84e-71a4-ad93-35d90a43a424	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c850-7332-9f95-a7e0b4ba5467	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c852-710c-92ee-dfedc72a50b1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c854-7361-8ecc-8b105da6e9c9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c856-7008-af22-158d5c62ff46	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c858-7193-9c61-29dd1170b5c1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c85a-729a-af25-af22d056f461	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-06-25	f	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c85d-726c-8712-149dd33d51fe	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c85f-7141-a664-d5f4dbfe0fdc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c861-7186-a160-04c83f09b771	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c75-c863-7177-8a43-2492a28c4307	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-06-25	t	\N	2026-07-13 14:10:50	2026-07-13 14:10:50	\N
019f5c51-07ad-70e9-9fa7-c691a6634f4b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-07-13	t	\N	2026-07-13 13:30:42	2026-07-13 14:12:17	\N
019f5c51-07b1-736f-8b11-490f930b6bd0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-07-13	t	\N	2026-07-13 13:30:42	2026-07-13 14:12:17	\N
019f5c51-07b3-7179-8b4a-75064101b28f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-07-13	t	\N	2026-07-13 13:30:42	2026-07-13 14:12:17	\N
019f5c51-07bc-72b4-bd77-d22062a626f9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-07-13	t	\N	2026-07-13 13:30:42	2026-07-13 14:12:17	\N
019f5c51-07d0-710d-b18c-05c576a20cb5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-07-13	t	\N	2026-07-13 13:30:42	2026-07-13 14:12:17	\N
019f5c51-07d4-7207-9674-314226f543e9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-07-13	t	\N	2026-07-13 13:30:42	2026-07-13 14:12:17	\N
019f6bd8-ef41-7045-b443-6e06623e9ab4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-07-16	t	\N	2026-07-16 13:53:26	2026-07-16 13:53:26	\N
019f6bd8-ef52-73bc-be1f-be1890174913	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-07-16	t	\N	2026-07-16 13:53:26	2026-07-16 13:53:26	\N
019f6bd8-ef57-71a4-8c63-114edb5eb0a0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-07-16	f	\N	2026-07-16 13:53:26	2026-07-16 13:53:26	\N
019f6bd8-ef5a-73be-abbe-3be7720557e0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef5c-72dc-b0b4-9e7493015f93	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef5e-71ff-8bff-9a94e2b5a11f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef61-7364-80de-5d8d60dc90c4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef64-7087-875b-49dcd3f6269d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef66-7008-8568-12d3d3c3a394	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef68-7107-ab4c-128aee507c22	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef6a-735e-a597-ca963d73e1a9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef6c-73ee-98c4-91be6d87e71e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef6e-73ef-9a7e-63af71c0e19b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef73-718c-8b7b-6b9ac81aa91a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef76-711a-a699-aa13790db072	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef78-7016-b1d4-d1c7d01b8ed4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef7a-73fc-9e52-32c3ff6360fa	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef7c-7013-8f71-14eaa7dd2ea3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef7e-73c3-afdc-b7813b32e0d1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef7f-7028-8235-72fc5e040ff1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef81-719b-b37b-d1755319009e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef84-71e0-a8f1-fb15b48c838b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef86-71c8-bef0-a30dd3d9a0e0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef88-72fb-8f72-7c766cb62290	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef8a-7007-9e73-f5e7b093f38c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef8c-7125-b2ad-d447796b2d81	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef8e-718a-bf67-8579ec491d52	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef90-726e-842d-6ed3b0686cf9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-07-16	f	\N	2026-07-16 13:53:27	2026-07-16 13:53:27	\N
019f6bd8-ef70-71d2-9c27-03cce7223bda	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-07-16	t	\N	2026-07-16 13:53:27	2026-07-16 13:54:47	\N
019f6bd8-ef55-738b-a576-b2173cfe4be3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-07-16	t	\N	2026-07-16 13:53:26	2026-07-16 14:48:12	\N
019f8092-06fd-738c-9f9c-b13bfe32f51a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0710-7094-98ea-d86c27ed804f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0715-7287-ab32-114b3aa97e4e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0718-7043-8a04-86d2b56b9801	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-071a-727f-87ca-5f45526f8c64	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-071d-7185-93b8-969ea31c9f09	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0720-706b-ac43-c4c63b8cc640	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0723-70a2-9db0-66b8935970fd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0726-707d-9d6f-b7bdf4671502	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0728-7101-8c05-cd947d1b6283	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-072a-73da-9f86-70f70eb55c0d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-072c-7014-831d-e752080e96d6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-072e-73fe-bd7a-f6f2ef17ee72	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0731-7214-b253-3b98e6f1f669	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0733-7251-87aa-50d0bfd6dab6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0736-739a-b6bd-8db0c2a9a261	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0739-7320-b717-db3a57c421e7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-073b-72d9-83a1-4974be05385d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-073d-703c-af3b-b8b6caf91cee	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0740-728d-88a5-16f80a91bd9e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0742-7311-86f1-527b7a3784cd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0745-7104-abd2-3d109c126099	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0748-72a4-9a2b-4bdb94316d1c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-074b-739e-97f2-6efb0710a059	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-074e-7344-ab7a-e2d7a192d2b8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0750-7336-8142-ac4a4d5febf3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0752-7326-977b-ad86c16576df	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0754-70e9-a915-23d75cc55ed3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-07-20	f	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0757-7123-a999-af32c9dbffd7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:28:01	\N
019f8092-0712-7303-b516-435ccd4b4df3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-07-20	t	\N	2026-07-20 14:28:01	2026-07-20 14:39:27	\N
019f8fe7-d82d-7141-8dff-16cf60db5796	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d842-72a4-97c4-db6e3d7eae41	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d848-7388-8ccf-ac327ff53090	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d84b-7258-8d86-18ac49a5c5a1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d84e-7321-9baa-d192ad6db40c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d852-72fa-a531-3249422ce20c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d855-72bd-ac03-b9b7e7e27931	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d859-71e4-bed8-dc7e9c397347	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d85b-738d-b3e6-0dbb40268e0e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d85d-729e-a8aa-5e952fad9fee	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d845-704b-a7f7-aef6b2bfe0df	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 14:34:56	\N
019f8fe7-d862-72c6-8a74-f5b0d0b953fd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d86c-7167-ba4c-5a248148f54c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d86f-7231-a47c-32b4909e0f18	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d875-71be-a770-4dde5ae55025	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d879-73a9-8249-83267dba1ae9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d87c-730f-b0a9-8ed7ce6dd9bc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d87e-713a-8e4d-40cad98aad30	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d881-734b-9756-dbe073e5ebd3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d884-73b6-a277-c20b52adba90	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-07-23	f	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d887-71ce-9be8-3064c02c255e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d88a-73fe-bfdb-e8414b3b3be7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d88c-73bd-8b37-60219a19387b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d88e-7228-9cdb-52a280340403	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d891-7084-aa4f-3dfee0a0b4ab	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d893-7002-b318-606f11a67fd2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 13:56:03	\N
019f8fe7-d860-7364-96d1-a1910a820554	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 14:19:57	\N
019f8fe7-d867-70b0-9a28-602e3c5dc509	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 14:19:57	\N
019f8fe7-d877-7028-94ea-276acf92a637	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 14:19:57	\N
019f8fe7-d872-7115-8edf-be2fbc86fcd9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-07-23	t	\N	2026-07-23 13:56:03	2026-07-23 15:05:43	\N
019fb407-9abc-7388-bc17-d9e88e9582c7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9ad0-72c8-abb7-503154485702	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9ad3-7197-9b3a-8488ba93cb1c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9ad6-723d-b74f-f60c2377b407	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9ad8-736b-abf9-982c6fcfd3cd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9adb-726e-ae95-7f2145c7e9e6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9add-71e5-b051-ee2d4252b1ca	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9adf-733e-9517-112e0e83a48b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9ae2-7322-ad3e-9339c0274d2b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9ae6-730d-baf3-eed0dd6ec37d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9ae8-707d-a9c5-eeb386e43f2f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9aea-7274-9e5b-6f67c98ef84e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9aec-7175-85a3-aa64b8be17d6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9aee-7291-86e8-37a02898c54f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9af1-71cd-bc1c-2c9b1503631e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9af3-72bb-97e7-38c5d0bef626	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9af6-71e1-abd7-1d5f1f20b8d9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9af8-70ab-a590-d0b24cbfbca5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9af9-716d-9bff-1cc0c5646f5c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9afb-72fc-93a4-8e9201f54000	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9afd-7013-b056-7b5bd67a29e2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9aff-7236-8008-1984bfd9f397	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9b00-73a8-9d42-338b9aa1b7a9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9b02-7200-a927-93ac0170c8c3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9b05-73e6-b435-9aaea3cb5c45	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9b07-7232-bbb8-9fd2bdcb4e68	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9b09-7300-90d2-0c89e9c261d5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9b0b-702c-875e-07add1bd7979	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-07-27	t	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9b0d-7385-a5c3-fc06b3bdb001	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb407-9b10-7291-af6c-3f330303d55f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-07-27	f	\N	2026-07-30 14:17:05	2026-07-30 14:17:05	\N
019fb409-406c-719a-b672-fabe61181eea	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-406f-72a1-893c-8f21a7dc6a47	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4071-71c2-9322-03b5ff24400e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4074-73db-8040-6e0ab7b8713e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-07-30	f	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4076-7202-b8b8-2fd5394c300a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-07-30	f	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4078-72f0-ada7-6c639cb8cf9b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-07-30	f	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-407a-7127-9e70-fd1cb90f7cb3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-407c-7333-804c-1c2bdac68b15	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-07-30	f	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-407e-737c-bf97-da9d30830369	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-07-30	f	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4080-70cd-a3b5-5a39d301afde	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4082-7329-913f-7f9c30a3fdf7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-07-30	f	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4084-73c9-908d-0fdbb9669cc8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4086-7116-93f4-d9affc0457b2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4088-7277-9406-cb3208564f60	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-408a-7205-a4d1-94472a09116b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-408c-72e1-87cd-c7d9bcdeb066	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4090-73f5-b24e-fb76f1296eb6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4093-7298-821b-0394deda5645	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4095-7367-8515-5beec6e102d9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-07-30	f	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4097-72e4-aba8-34f62ec0d6c8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-4099-70df-a407-86b6c7e86b31	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-409b-70e5-8fb4-aa7fd473b956	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-07-30	f	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-409e-7287-9e5e-080812e05461	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-40a0-7244-acba-0eaf54eddfc1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-40a2-709a-a37c-2db542a27a12	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-40a4-7203-a91d-4790f29df3f4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-40a7-71f3-812b-44c2b9016f7f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-40a9-7013-8991-653aea930c43	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-40ab-72c5-b869-b5d33d9308cc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:18:53	\N
019fb409-408e-73dc-a0ca-5db9b332de7a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-07-30	t	\N	2026-07-30 14:18:53	2026-07-30 14:35:32	\N
019fc8a0-0ba2-72ac-941b-8a35605bb2fd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bb2-71d7-8432-bb742e5873a8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bb7-7269-ba57-d0873d7fbf26	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bba-704e-9a8c-cd2f25ea1c7b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bbc-70b7-8a96-303573cea46f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bbe-7067-ade4-6a1ebfda4265	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bc0-7188-bd84-f21bd8052f70	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bc4-729f-8a56-5d816715ce2a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bc6-70c1-9a2d-65a1d8f2b480	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bc8-712c-b781-2cf077121c1c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bcd-73db-8c99-7712ec86419c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bcf-73ad-81ba-946410345e5a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bd1-7053-b8f6-8041b93b9634	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bd3-71d3-b018-9c3ad03754cf	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bd6-7180-b1bc-5fb74f9a169d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bd7-71bc-a531-324e16b80341	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bd9-724d-b4f1-2b9272902005	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bdb-72df-9cfa-ca4f381352e9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bdd-7188-a1d3-82274dcabcb4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bde-71db-b174-9401efd13668	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0be0-7369-a4b0-69a80630bd98	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0be3-7340-b5cb-fa1c2593f8c5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0be6-72ea-8537-089b18cba63d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0be8-73f0-8f03-82e1b23c7fed	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bea-73a4-afbb-97dc3af72f7a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bec-73b0-8fbc-e3ecefe2d440	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bed-73bb-9ed7-05ada9a705f9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-08-03	f	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bef-739b-8efe-949d22c8f6ce	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:15:59	\N
019fc8a0-0bcb-7210-8123-003f86287178	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-08-03	f	Consulta médica	2026-08-03 14:15:59	2026-08-03 14:17:28	\N
019fc8a0-0bb5-7073-945a-6f96a964649d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-08-03	t	\N	2026-08-03 14:15:59	2026-08-03 14:32:45	\N
019fd835-afa2-73ec-95be-b599e4186c00	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afb5-71be-8946-6e894136418a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afb7-7142-bd7e-e90780d5af75	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afba-7186-9a07-099c19d34e23	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afbc-70ee-b19f-293ce99abd31	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afbe-71e6-b454-6d66a9a31c39	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afc1-70e8-96a0-bd48ffdc8cc9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afc4-725f-8b94-bbd2f693a72f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afc6-720e-b9f7-2a34126e0e18	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afc8-7310-9c12-ad385f553a1c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afcb-7049-8c6b-4c68211a5c47	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afcd-703a-8ac2-7f335b1a71f2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afcf-7274-af00-54a78320d1ed	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afd2-7234-b6e6-06d62bd8acfc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afd5-71ff-88ac-d58a86af4fc1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afd7-7090-b95f-ac2437a31ec9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afda-717a-9ef3-9427d1143db3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afdc-73bf-bbce-fd17964a708b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afde-72ce-ae00-51b139c2211f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afe1-70da-b2ba-ee9d4e3643bf	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afe2-72d0-8be7-caf591231997	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afe4-702d-95ce-756e77de927a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afe6-7308-a98a-df3c4161eec2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afea-73e8-a0c8-b01e33c8cc1d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afec-70d1-a166-14cc62b9e06d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-afee-70d8-a10c-fa2d2e4b48ec	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-aff0-7342-a79a-59c4a67af268	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-aff2-7085-b3f2-a7c5c75e80c5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-aff4-73a8-8c7a-9f642abb5d62	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-aff6-73e1-a05d-cbbb57003e14	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-08-06	t	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019fd835-aff8-701d-91ac-0aae65c4b165	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-08-06	f	\N	2026-08-06 14:53:44	2026-08-06 14:53:44	\N
019ffbfa-c0b8-7182-9cde-3a0cbf4a3362	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-08-13	f	\N	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
019ffbfa-c0ba-71f5-ac43-e30359a75342	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-08-13	f	\N	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
019ffbfa-c0bc-7303-98cf-e0d97f630630	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-08-13	f	\N	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
019ffbfa-c0c8-7050-881d-4844331bca1d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-08-13	f	\N	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
019ffbfa-c0cb-7197-b011-95f1a05519fc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-08-13	f	\N	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
019ffbfa-c0ce-72d9-be4a-3d4c50f98f25	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-08-13	f	\N	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
019ffbfa-c0d0-7290-8410-e869fa7c29fb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-08-13	f	Médico Dracena	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
019ffbfa-c0d7-72a2-9db0-837d35e0e837	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-08-13	f	\N	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
019ffbfa-c0df-70c5-8aaa-eb27e596b6f6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-08-13	f	\N	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
019ffbfa-c0e1-73e5-9bae-1f7caab2eb17	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-08-13	f	\N	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
019ffbfa-c0e7-7193-bc35-d86b2a1278ed	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-08-13	f	\N	2026-08-13 13:35:42	2026-08-13 13:35:42	\N
01a02018-3ba6-71c2-90d0-5e0d4578eba2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bb5-73d3-932c-082744f201a8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bb7-715b-907b-df5780fb8f77	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bb9-716c-956b-f9686dbe1c73	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bbc-728b-be4a-123803c84779	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bc3-720e-ab20-17ce04f98052	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bc4-7263-b6e6-70c04cd7f922	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bc7-71af-8b2b-fa32f935f313	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bc9-73cd-8107-e84d1fb61b88	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bcc-700a-9553-02eb7a66fa85	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bcf-720e-a6c4-9b5b90b043e2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bd1-70fc-88b7-a4fe4c3f0688	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bd3-72b8-a183-952be3bbbe39	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bda-7115-bbff-f08922cfc220	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bdc-7273-8218-d8ef0ab1777d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bde-7107-aa47-9c0c364747dc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3be2-71fb-a083-e5bb1f04dace	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3be8-7224-8eb8-e8b842a1af10	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bea-71b0-89bd-98ffaf92c54a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bec-7363-9246-e5fd69cf62fe	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bee-734c-a52a-2e42d1237eac	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bf0-73b7-9192-43c0e9d22bc3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bf2-73c4-aca1-099fd0efa743	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02018-3bf4-715d-b5ad-f6338f742a54	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 13:54:14	\N
01a02023-34a5-73a5-a803-175f17adb1a4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02018-3bd8-7357-ae99-22c51257237f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 14:00:11	\N
01a02018-3be5-731d-b0a0-abec3f724ff6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 14:00:11	\N
01a02018-3bbe-725e-9bb1-bcac8b9d5d1d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-08-20	f	\N	2026-08-20 13:54:14	2026-08-20 14:01:01	\N
01a02018-3be0-73a9-b321-43a1f43e6f9a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 14:01:01	\N
01a02023-348e-739e-a3c9-36052417dd81	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-3492-705b-b778-7a4da8d3ed6b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-3494-7163-b09b-df18d18cf104	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-3496-72ed-ac12-0d604cfdd02d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-3498-7136-b121-7deaeac314db	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-349b-735e-bd88-6507c81fb3d8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-349d-73fb-9d81-1bf44cfde08a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-349f-7028-b533-d97bafad6339	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34a1-725f-8c4e-37b836e6b762	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34a3-72ce-83ea-4e27e2a569ab	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34a7-7094-b8ec-1333888b48ec	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34a9-7220-93c6-c1dea17df7e3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34ab-738f-9ea6-bac82997c0a3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34ad-71e1-9d8e-f8339f501112	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34af-737a-a7f4-25f31e9153f3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34b2-73ff-adb2-168c1c8a641d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34b4-7286-8793-79d3c9a02b9d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34b6-7216-8ab0-eb0bb74bcd73	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34b8-72dd-add2-7e43b09b48fb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34ba-702d-883f-8937164439ca	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34bc-735e-9a8f-8faff2b47909	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02018-3bc0-723b-a066-4152e17edec0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 14:15:35	\N
01a02018-3bcb-7283-9963-d60d163f5f4a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 14:15:35	\N
01a02018-3bd6-7355-a138-9da968c98ff2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-08-20	t	\N	2026-08-20 13:54:14	2026-08-20 14:17:52	\N
01a02023-34be-70c9-a281-7c822cd7c8a3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34c1-732d-89bf-606ff22ff5be	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34c3-702a-b7ae-fe242adf0b95	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34c5-7190-a550-1cac15b621a8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34c6-731f-83ef-2cb1ab229367	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34c8-71cb-8fa1-1b5190a174e0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34ca-72cf-b2ac-144f1c1879a0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34cd-70f8-8f59-0d72d1f0ccdd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-08-17	t	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
01a02023-34cf-7193-bafc-6c03887a67db	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-08-17	f	\N	2026-08-20 14:06:13	2026-08-20 14:06:13	\N
019ffbfa-c090-70f2-b73d-6d9fbd12edf7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0b3-7230-bc8a-1b029b295573	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0b6-7202-a113-f51d4caaa455	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0be-73b5-b7d7-9c40613ca9c0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0c1-7372-a9ee-286c835089cc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0c2-7242-a410-27360ff05c0e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0c4-709b-afde-5aab87050512	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0d3-7204-a7ec-fd5e58d60023	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0d5-7183-9739-bf66c8d2e5ff	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0d9-709b-8dad-e4f0e16551ce	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0db-739a-a799-be19b26b9b3f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0dd-71ca-bb99-89a63c72e114	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0e3-7252-ac17-3aea7c357452	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0e6-7236-ace7-ac641df183db	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0ea-7087-9dfc-3295e1df29bd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0eb-725e-950b-a941c0aac4a3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0ed-73fa-9faa-83ce5705dc7c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0ef-70a0-895a-8a6dd027eb6e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0f1-730b-90b2-d4c0f4ac031b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
019ffbfa-c0f5-7320-9abd-c5ff438e59e1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-08-13	t	\N	2026-08-13 13:35:42	2026-08-20 14:09:07	\N
01a0202a-c4c4-7183-a622-3d0dfb1fbc40	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4c7-7255-b15a-09b68a6c3199	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4ca-7060-a929-f69ee4275569	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4cc-71e3-92a6-027a3300feea	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4ce-7269-a31e-755dbe02988b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4d0-7117-ab44-6116b73f570c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4d2-7331-bbe1-910f162daca8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4d4-7145-a2db-0bf5dd11e4d7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4d6-722f-a8d8-692bcb2bab78	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4d8-7090-945b-a8f887990d83	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4da-7259-bc8f-f1c78eb6ac19	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4dc-706c-bfc8-71561c0b6268	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4de-7232-a6d0-ccb1c6553e1a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4e0-73f5-a6b0-cafac5b16152	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4e2-73ca-9b5f-fc9633ed05cf	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4e4-727c-8f9c-e4b506fc353a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4e7-72c1-b856-0634fa79cfb8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4e9-7312-87d2-9aafa1125ebe	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4eb-72e4-b06c-051588a3ac97	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4ed-7095-9f00-546c6e68c041	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4ef-731d-81ce-9e5dc54551af	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4f1-71f0-aeee-df42d30e1b6a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4f3-705f-88f6-90d5e41fc90e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4f5-73d9-930f-2acf036405d0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4f7-717b-9c27-484ac74ae410	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4f9-7177-8dc8-910523adc10f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4fc-71d3-8a05-29a653ba45d8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c4fe-71f2-ac5e-c6287e75abb1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c500-733c-87c3-68c2219c1870	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c502-7115-8203-32bc41b634e1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-08-10	t	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a0202a-c504-719f-8567-06e74698de71	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-08-10	f	\N	2026-08-20 14:14:28	2026-08-20 14:14:28	\N
01a034c5-0101-7068-8ba5-9dfe9e3c48a3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0105-72d2-8aa0-b1390464df5b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-010c-722b-aa55-6414b6079ad6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0110-73d4-b034-68284d29a147	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0113-7366-8bf3-8f77826a7389	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0116-7309-b239-e3d9981df910	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-011a-7337-b012-5efe6316485e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-011e-7308-a97a-147e9487196d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0121-708e-b371-ff9438071657	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0124-72e5-88fa-0076d238757f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0127-71be-a947-a2357a28610b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0129-7027-a769-f1eae906022a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-012c-70f7-9646-90503e7e6105	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-012e-72dc-a7f0-04568c777b62	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0130-73f1-b226-556de33710f7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-013d-718d-bda2-c701bc33a2f4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-013f-7257-8ea3-55d15ad99e26	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0141-71ee-a313-3c0da29439fd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0144-7188-8d26-c9a7ca674e7c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0146-7243-bf6b-18af122bac98	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-014a-7177-9ed3-2ecd5be6f99e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-014c-71fa-b15f-99b9d1cc63f9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-014e-7300-b53e-47942b03ae4e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0150-7061-bd86-8328920036f5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0152-71a9-9b26-e569b9884c38	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-08-24	f	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0155-7051-83c0-9012b5b9ad19	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0157-73d8-876e-b69046d5cef5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0159-711c-a6da-68c79f4e1a51	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:15:21	\N
01a034c5-0107-707e-bdf4-9f883199b7ab	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:21:27	\N
01a034c5-0138-72d7-837c-151214cf95d6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:21:27	\N
01a034c5-013b-71f8-8d1e-3e867147771d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:24:27	\N
01a034c5-0148-7349-8ca7-62d6d0b49aab	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-08-24	t	\N	2026-08-24 14:15:21	2026-08-24 14:24:27	\N
01a0443b-3eff-73f0-8ed3-e727a5457cf8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-08-27	f	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f0e-73b6-bebe-62c6f8df160b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f11-71c9-91b8-2e24b34a3bb0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f13-72a2-8bf0-eb1ba3c908e0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-08-27	f	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f16-717f-aad6-53c61ee3d423	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-08-27	f	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f18-702f-a6c4-4aea61742cc9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-08-27	f	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f1b-7089-834c-06ce3a9e78df	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f1e-71c6-9415-33dd2ef78e5a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f20-72f5-a402-5aea31415c68	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f22-734a-99c9-3d1142bb47f0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f24-7207-9b6e-720a819a0f24	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f26-718e-8b78-e110422d09bc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f29-73d4-beb3-2b10c59b34b5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f2b-700d-8c92-5cdb44621859	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-08-27	f	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f2e-7208-ba3c-09b1a129b7cb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f31-728c-a4d3-6bff8aa6daaa	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f35-724f-97ea-f94ba33e605a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f39-7269-9b0a-39a8d7523c86	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-08-27	f	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f3b-70fa-926e-23cc77765507	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f3d-72e1-899f-bdbab0c69b07	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f42-7107-bc80-dbf1cb6373e8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f45-711d-8dcf-123ac6a3f60e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f47-7354-8e8b-b6e7567164d0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f49-7142-87ba-0784ddb62d91	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f4b-71ff-bced-8982654bb976	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f4e-70e4-95ce-f6eaef79d4e1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f50-73d5-bcba-82661b274cd8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f52-72cd-97da-a1fcbb5b0d7e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f55-713d-b025-0625b7a61a16	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:18:48	\N
01a0443b-3f40-7086-9757-f38cd7234b3c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-08-27	f	Viagem para cuidar de netos	2026-08-27 14:18:48	2026-08-27 14:20:48	\N
01a0443b-3f33-7152-a8cd-805dc78e78b6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-08-27	t	\N	2026-08-27 14:18:48	2026-08-27 14:21:19	\N
01a0443b-3f37-73f8-8a15-8333743b4e75	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-08-27	f	Afastada para cuidar de netos	2026-08-27 14:18:48	2026-08-27 14:22:30	\N
01a058b3-da9d-7058-94ce-0ed74df92af8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-daa2-7254-8f3a-27817b1df548	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-daa5-7377-898d-3b7208788c95	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-daa7-70e8-bb45-416637a5ffd7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-daaa-70ed-98ff-2ec70a066402	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-daae-72f4-a3ee-7d616f451f9a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dab0-71a7-b440-466943508c94	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dab7-73ca-974e-4d823df770c4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dabe-708a-90e6-ffc9ce159fb1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dac0-7010-b4e8-f225ab609756	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dac1-7048-a717-d379b6a0bd3e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dac6-7000-a43e-0578d1a5f475	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dac8-7191-aa8f-cc53ab3ca274	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dace-7304-a239-4dda11dc7582	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-08-31	f	Em viagem para cuidar dos netos	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dad0-72a5-b442-1635dda4d781	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-da8d-73fc-8317-77651d55043d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:43:55	\N
01a058b3-da9f-70b1-9a57-ea00fa074a78	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:59:40	\N
01a058b3-dab3-7012-bb0e-57f99a84ff15	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 14:10:37	\N
01a058b3-dad2-726f-802c-897bf695c4ff	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dad4-7009-a35f-e0131c4e690a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dad7-7192-b475-e83efab40271	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dad9-71b4-a519-df52a480fc84	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dadb-70c6-ba9e-4e9343665fa7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dadd-7268-a5fb-3484ca8f946a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dadf-72c9-8b53-6a4a3c9fdbd7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dae1-72f1-b7b7-b387cfec8b00	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-08-31	f	\N	2026-08-31 13:42:57	2026-08-31 13:42:57	\N
01a058b3-dab9-701e-9230-a421d5b4a65f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-08-31	f	Em viagem para Campinas para exames médicos.	2026-08-31 13:42:57	2026-08-31 13:43:34	\N
01a058b3-daac-7301-b4ef-dc4ea83bd047	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:59:40	\N
01a058b3-dab5-72b1-b34a-3920a8a5b298	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:59:40	\N
01a058b3-dabc-7103-a6fb-60159ec42f2a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:59:40	\N
01a058b3-dac4-7277-aae0-a1a2cdb23ac1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:59:40	\N
01a058b3-dacc-70c7-84bd-18a5a8ff8b62	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 13:59:40	\N
01a058b3-dae3-7062-ba70-2b5d4fd159d8	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-08-31	t	\N	2026-08-31 13:42:57	2026-08-31 14:10:37	\N
01a068c2-b59d-71c0-8eef-ea6c408f7652	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5ab-71f0-90b2-0e6ce0940a2e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5ae-73aa-a248-3c57b341b176	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5b1-70a9-8055-a02ad66deb7e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5b4-7089-9c26-1f9278de05d7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5b5-7322-8f1b-71191721f86e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5b7-71e4-9f4e-2062e2e2d954	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5b9-72d8-b00d-ef484412618c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5bb-73e7-b94a-cc58901bbbfb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5bd-72c8-bbbd-310a7f82577e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5bf-71fc-8dd2-8d352743ae26	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5c2-721b-ac58-0c0c415f8d78	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5c4-73f2-8ce0-7e76eef8252c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5c7-735f-97c7-ba79e2672d83	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5ca-71ee-9784-0beda14a8dec	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5cc-706f-97bb-6b8675cbfa84	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5ce-7246-a218-3e4c0db3c1f7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5d1-7136-a5e7-ca00e05f16d2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5d3-713f-9cb3-fe99e8760c64	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5d5-73b2-8e80-90fb01be42ab	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5d7-710f-8275-caea662b439b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5d9-71a5-ab1f-7f3f93ae056e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5db-70ab-b594-bda1d0f513cd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5dd-727b-9ea9-3168b6402251	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5df-7318-9a96-99d809390e45	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5e1-7391-ab64-758a86e42f3a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5e4-700f-89bc-a8c43cbd1ed0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5e6-70e5-9e08-4a9991a5fade	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5e9-735a-bf0a-290528b966b3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5eb-71dc-ab35-dc681ea39f3f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5ee-7229-80e9-073e0451e332	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-09-03	f	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5f0-7063-a6ac-66a34e5b4eca	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a068c2-b5f2-7243-8840-6f48c625af65	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-09-03	t	\N	2026-09-03 16:33:06	2026-09-03 16:33:06	\N
01a08c6c-e87c-717c-b3bb-8f284fc96997	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8a1-70df-9932-307cf51b0591	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8a4-7130-aa7a-457a401a6d57	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8a7-7115-b214-9a6c353133c0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-09-10	f	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8a9-73aa-ad7d-1c1d09718af3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-09-10	f	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8ab-7180-8e1a-d451b6f400c3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-09-10	f	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8ad-7177-9a38-6b66fc6c3d95	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8af-727a-8b4e-e84c5ff6e788	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8b1-7231-a5db-c1fd5ca81e98	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-09-10	f	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8b4-718d-9c61-a0d49cc1f39e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8b6-7009-b2bc-cf17884f88b1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8b9-7313-b098-a628e4c68d3c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8bb-72ac-8fb7-1aa44d681b86	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8be-735d-bb88-d67e9ef54815	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-09-10	f	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8c0-73d9-b121-b0212153c12a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8c3-7309-8e01-c77cf8624434	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8c5-702b-b23a-382310df60a8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-09-10	f	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8c7-735b-af30-4e83ab5d545a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8c9-7123-a686-b8e985133f65	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-09-10	f	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8cc-7343-ba37-5526e1fbb0cd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-09-10	f	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8ce-70e8-b27a-380ecb6996a7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8d1-71ad-ab67-a4e2c2a83b53	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8d3-7071-8085-c7f1a345a69c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-09-10	f	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8d6-7152-bfce-50c672fe6ba2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8d8-701c-8242-cb37e3178743	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8db-70f1-b543-401feb1bcb74	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8dd-710d-9f8b-f5bbe40e9cc4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8e0-7166-945d-9c78a447972a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8e5-7055-93bc-c362e6f3ff84	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8e7-7228-b9eb-5ad6367db9ea	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8ea-7327-87ea-cd45b0ea5b87	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8ec-7200-80b2-2e7a06cb1662	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a08c6c-e8ef-736b-8277-bc1d8e8f5d2c	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-09-10	t	\N	2026-09-10 14:45:42	2026-09-10 14:45:42	\N
01a0a0e5-3ba0-723a-8078-038d694738d9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bb0-7307-ba1f-8c63f2711d7b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bb3-731a-b8e3-e2bbf74e7f20	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bb5-70b1-8d9e-d6a1c51eeccf	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bb8-70db-9fec-6e96f815f053	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bbb-728f-be35-20f73846c945	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bbe-704f-beca-4559249c512b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bc0-7397-a707-a06decc8b6d8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bc3-7015-89e5-c309ab68ba27	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bc5-7261-a4da-6ef68f8738f9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bc9-715e-a80a-cb6770faa2ef	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bcb-72a2-a97e-ccd7b73b7ebb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bce-71ed-8b8c-fd9a7e518c94	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bd2-72a4-a07c-08bd4c5d8f2f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bd3-71b5-9f54-a6ed3b95c9cf	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bd7-7256-810e-a23d24fa49b4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bd9-723a-a60a-ae62c9b763eb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bdb-73ea-8149-844cc1568f0c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bdd-716d-86d1-69bdccbbc78b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bdf-7108-bde2-5569b5ea0990	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3be2-7036-b179-7b38d9cecc91	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3be4-71bc-a372-389f989e83c6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3be6-73ee-b75c-61b10546daf2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3be8-7214-8e8f-24de6ea5d404	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bea-72c5-a732-3f21b32cb12b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bed-72b4-abea-83132f88ccdb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bef-7096-afaa-3bdecd6a8c70	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-09-14	f	\N	2026-09-14 14:09:32	2026-09-14 14:09:32	\N
01a0a0e5-3bd0-728f-976b-9118d97c030d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:10:52	\N
01a0a0e5-3bf1-70ad-a76d-320f413c3006	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-09-14	f	Consulta médica em Dracena	2026-09-14 14:09:32	2026-09-14 14:10:52	\N
01a0a0e5-3bc7-731e-b8a4-53076fd64212	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:27:29	\N
01a0a0e5-3bd5-707f-8b4b-794b8c29308c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:27:29	\N
01a0a0e5-3be1-7172-a0ec-6a4110fb9f5e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:27:29	\N
01a0a0e5-3bf3-7397-9157-29a087d396ed	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-09-14	t	\N	2026-09-14 14:09:32	2026-09-14 14:27:29	\N
01a0b04f-606f-728a-a84a-0f72b5accff1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-6080-72e7-a1ff-0035fcb3a600	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-6083-73ed-8c6e-4b3e4d9de73d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-6087-7354-ae0e-6ed5362246df	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-09-17	f	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-6089-7319-ada8-7fe5ca498b1d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-09-17	f	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-608c-7329-ace0-351ddb93d6c9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-09-17	f	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-6090-7022-84f0-9aba1be15cff	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-6092-7030-acf0-9f7cac1d324f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-09-17	f	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-6095-7078-93b4-ca2df520daf7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-609e-7214-b34b-37356fb73ec4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-09-17	f	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60a0-73b3-80f1-6bb9cc8251d7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60a3-70ba-8bc9-1e0739dc70c2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60a9-721a-b524-f0b44c93a4f5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-09-17	f	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60ab-71d8-94b7-349939951e12	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60ad-73db-941e-41b43a707841	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-09-17	f	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60af-7352-baed-8c7d77459cbb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60b1-73b9-93df-3d39788d5ab9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-09-17	f	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60b5-7069-a9d3-d24f1c99898a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60b8-73fb-988e-c04a675ae258	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60ba-70bd-9816-35d1f8e3d3f6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60bc-71ca-b682-c4e9df97a598	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60be-7047-9d7b-af0edcd718d6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60c0-728d-9183-ff7d6e9caebd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60c2-73b9-b21d-bf8f293cbee6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-60c4-7153-8b2e-727a8d434e59	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 13:59:47	\N
01a0b04f-609b-7382-9593-07f0142e333d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 14:00:35	\N
01a0b04f-608f-70ac-8609-78612a24af55	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 14:57:37	\N
01a0b04f-6097-7278-ab12-b78a7e2d48b1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 14:57:37	\N
01a0b04f-6099-71af-af2e-84a2db5393d6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 14:57:37	\N
01a0b04f-60a5-7093-b179-5a54ed3e1f9f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 14:57:37	\N
01a0b04f-60a7-7203-a8aa-43e96b73dc51	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 14:57:37	\N
01a0b04f-60b4-7096-af50-de030812b057	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 14:57:37	\N
01a0b04f-60c6-72c4-a523-4a9c04e652e4	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-09-17	t	\N	2026-09-17 13:59:47	2026-09-17 14:57:37	\N
01a0c4ed-d1e1-7374-a610-df8eb56d1c07	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d1f6-711d-8d6f-78e20e41412d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d1fd-701f-aeec-d3fc19721ce9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d1ff-70ee-901e-e7cdb8330256	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d202-71bb-b110-bfd8e5f85147	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d205-710b-9604-5344dc437d33	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d207-71d4-b0fc-04aa5ffe4bed	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d20a-705b-807b-11666960d417	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d20c-71ce-b771-58b2750b1d69	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d20e-71db-a4b5-d80921c64e8f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d211-7361-a953-b0da112d49be	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d213-7012-8209-abddf5411f5e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d215-70bf-b713-f35fe6485099	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d218-7062-8aa9-439d66ab30ce	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d219-72cf-9be9-827a22c26f7e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d21b-73b6-9efd-ba3ec2dcf8ee	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d21f-72d9-9de8-427705f7c512	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d222-7239-9d7f-864e616c18e6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d224-7004-8141-106425f26a7f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d226-707f-b129-7b36b22b0ab6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d22b-70cd-857c-90edb92b0248	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d231-7030-933b-e890b27312e2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d233-7249-9982-c1ff785cca6b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d235-70cf-81d7-2d6173b82be3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d238-7238-b011-41b071b4c477	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d23a-70a1-9fe2-fa01df0edd67	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-09-21	f	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d23c-7244-95ee-e884a8d2f691	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d243-7206-b334-06a9a85f6b3c	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d246-704e-bc25-9baa1398cca1	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:05:15	\N
01a0c4ed-d1f9-7047-9cc9-a60ddf2e1825	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:47:33	\N
01a0c4ed-d21d-719e-9e44-210afd6dc60b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:47:34	\N
01a0c4ed-d22e-708a-a86d-a32bc546bbf4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:47:34	\N
01a0c4ed-d23e-701e-9bdb-6527831b81b5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-09-21	t	\N	2026-09-21 14:05:15	2026-09-21 14:47:34	\N
01a0d45f-6462-7263-b0d4-2f1831dac5a2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-6476-7278-8f49-fbb8afb55eac	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-09-24	f	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-6478-7385-ac49-6b8223ad4a64	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-09-24	f	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-647a-7081-b583-74ef13fd3218	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-09-24	f	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-647e-728e-9662-493aa1b8b83d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-6480-73a6-bbe5-76e44417e518	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-6482-70f4-b34c-9193fdaf24f8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-6487-7074-bddc-024effbdefd9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-6489-73a1-8a3f-426160a52040	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-648e-736e-8a89-ddd65fe41087	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-6490-73af-aa3e-ee45af1f22e5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-6492-7010-b3bb-7236bc60726e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-09-24	f	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-6497-708e-8cdf-a8996c1e062a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-09-24	f	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-649a-7145-9b8f-a72ee9e1a81c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-09-24	f	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-649c-706c-86d2-3ae5c4a44fd8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-64a1-70ba-9da6-a8eb2c0408ef	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-64a5-724c-876a-3520902145ab	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-64a8-7261-8deb-8d29fa2bdb6a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-64aa-72b3-b2d9-865f1591235d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-64ac-70c4-963d-e35472bebcf4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-64af-712e-b0aa-d5507f90f8a3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-09-24	f	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-64b1-7183-b9c5-c6b6b4bc01ce	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-64b3-732f-82bc-b1a4aa1572c2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-64b8-70a5-abfb-df49b8824f2a	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-64ba-70b7-b363-228b9dd7c329	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-09-24	f	\N	2026-09-24 14:03:36	2026-09-24 14:03:36	\N
01a0d45f-6474-7056-9769-2001d0eda559	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:21:12	\N
01a0d45f-647d-733b-99de-2db744658114	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:21:12	\N
01a0d45f-6484-7257-9a22-5339772d7d46	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:21:12	\N
01a0d45f-648b-71c9-9383-8b8e0dc150f2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:21:12	\N
01a0d45f-6494-708a-80b6-311bfe089430	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:21:12	\N
01a0d45f-6472-7002-841e-f60df3efcade	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-09-24	f	Consulta médica	2026-09-24 14:03:36	2026-09-28 14:19:34	\N
01a0d45f-649f-7389-82f2-01429fb4fbda	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:21:12	\N
01a0d45f-64b6-7230-8942-e2a1225c270d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-09-24	t	\N	2026-09-24 14:03:36	2026-09-24 14:21:12	\N
01a0e908-554b-7124-911e-b1cfd866b1d3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5557-723e-bc42-8f3cb3d7f283	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5559-7264-9eaa-8171b94aa5eb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-555d-71fd-a548-885b49feee5e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5561-7243-b397-bb3217799d92	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5564-7282-8b2b-7a5051fa8be1	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5566-71ed-b761-80e47f7b2056	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5568-70b8-a6e9-c45d8e9b54fc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-556a-7327-9136-5ab7e6455baa	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-556c-7050-9d96-3cbf021ea303	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-556f-71d7-9751-ffca750de573	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5573-70e5-b3c2-d9f6a6f213d2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5576-738e-8f39-b04757c2d5e7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5578-71a5-ac86-f78b86a32ecb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-557a-70ca-8009-cd20c5adc231	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-557c-713e-a1ef-04fdc6daa14b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-557e-7230-8583-42ce27c6ec99	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5580-72dc-a680-0787255cc8ba	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5582-73a1-8338-0e45d02d5c25	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5584-73c8-8a25-5715d87cb787	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5586-7003-be9a-fe742458c6ac	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-558a-7064-a92a-d97f699c886c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-558c-71ae-afd4-718dc5cbe6d8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-558e-71ad-a3bc-0a32398097bd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5592-72ee-9d1f-def7615a82f7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5595-722d-846f-ac6b661386e9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5597-73cd-8093-4dcb53eedef9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5599-7217-9639-ec99d4a4c29d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-559b-72fb-9ffd-281d75eaa21c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-09-28	f	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-559d-7152-84c6-f7a25651b96f	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:20:32	\N
01a0e908-5571-724e-9ab0-218569306c55	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:30:43	\N
01a0e908-5588-729d-9a54-00d1539c26d3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:30:43	\N
01a0e908-559f-72f3-888a-3ded042d257d	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-09-28	t	\N	2026-09-28 14:20:32	2026-09-28 14:30:43	\N
01a10d10-a5b5-734f-b464-ff834a7e3b72	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5c6-70b8-8dea-003fe4ba6963	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5cc-70f7-b653-7a2f7d3df2d6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5cf-7398-8e65-65259a621deb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5d1-7224-8a4e-3cfd811dd399	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5d5-7143-8e22-702a4feea042	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5d7-73da-bb3c-79bd947ec261	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5d9-7356-81e4-da4619f6d7f2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5db-72df-ab0f-9ed2443b5a26	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5de-70f8-b9b5-c73268312562	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5e1-73e5-b334-2df281de0620	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5e3-723b-a5d9-b870100df733	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5e5-7248-bb92-8d024d50bae3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5e7-715f-8860-9c0d427e9d9e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5e9-7277-a036-1ddbf0a91cb4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5eb-728f-abe5-ec9df779af10	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5ed-70fa-aeb2-a2fe5ddf6549	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5ef-723c-82da-1d0f50d800f7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5f1-717c-9739-e992fdb3fecb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5f3-73b6-8bc3-5463888e9fb0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5f5-7318-9113-611c30a23c6e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5f7-70a0-b93f-776feb425a2c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5f9-7133-84b3-40c5a2286500	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5fb-7329-9b91-8f51ecefcde7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5fd-72b1-9c9f-6e5cde24f7cb	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5ff-7249-832d-394258effcbd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a601-7095-b141-5a383e448f37	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a603-7317-8d67-d39d420adcf9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a605-7149-a4f3-b2eaaff80e2c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a609-700c-86d5-e19ee753d72b	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a60b-73fb-806e-9ce008cceed5	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-10-05	f	\N	2026-10-05 14:15:57	2026-10-05 14:15:57	\N
01a10d10-a5c9-7037-8d73-58305cc1274d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:19:02	\N
01a10d10-a607-731a-a7bd-fb8b114497c8	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-10-05	t	\N	2026-10-05 14:15:57	2026-10-05 14:21:22	\N
01a11c8d-5eec-70f0-ba15-510c9708f50d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5efb-71c5-bf3a-88a2367b3d0b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5efd-7267-a48f-02f258f76971	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f00-7331-b9ef-1672e6a7a536	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f02-72eb-a40b-b1645c3bad4e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f04-7351-be2a-cf0d7cfd1fe2	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f06-735e-a508-c234fb051fb6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f09-722a-8c0f-28464da34f4d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f0d-739a-98aa-d0964d161ac9	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f10-7146-b2bc-3008f1a447e7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f12-72e6-8070-328e4e81a45c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f15-7348-87f5-1e2e99b0fd15	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f17-72ee-9f8e-c1020661fc21	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f1a-722f-a6b5-4f31cac3e22d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f1c-7306-a60d-d57c40ac6320	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f1e-7017-aadc-1ded7821c450	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f21-707f-8089-0e1c9b4cee76	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f23-7087-9490-b69073d4c1c7	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f25-7296-8c84-d66ff251055d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f27-7261-a847-6b1f5a16adb3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f29-71f4-8f28-93c617201b7a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f2b-733f-9080-b4e08dc0b64d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f2d-7184-bf50-c18d919a78ae	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f2f-7361-a33d-ffdc66ca17fe	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f31-71b7-ab05-922022029fd6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f33-7137-8405-15280a7d0f6f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f35-72af-93a1-d97cc3429754	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f37-70a3-8ac3-c176d27dcd3b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f39-705f-b7bb-cce50fd044dd	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f3b-70ec-981d-24028340b02f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f3d-72a9-b2bc-239fcce8556d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f3f-7001-9f07-c4705d2f46dd	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-10-08	t	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a11c8d-5f41-7370-87f5-f49cdd606957	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-10-08	f	\N	2026-10-08 14:26:29	2026-10-08 14:26:29	\N
01a1407f-252f-71b8-94a4-82020ae1212f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea817-0c82-71c7-b46f-de652873a09f	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2541-7175-886c-05c2fc5fb41b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81a-e664-72b3-97df-381f7ae7433f	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2546-7060-b2cd-3a0d18b96431	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81f-3f03-7116-8007-175af8fba96c	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-254a-7147-b5d1-0e2693b889f5	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea823-851a-7118-9f29-6766c8001bf0	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-254d-739d-98df-a9391c266fa4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea825-ea62-705f-82a8-b7650680c160	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-254f-71b3-8d0a-15b76b589155	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea827-daea-703b-ae3b-3973d1efb81e	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2551-724f-8287-a3e9c16b0589	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea829-c2ab-715d-ab93-149420822a79	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2553-7269-a504-64e7cd2f53aa	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea82c-a7c1-7057-9199-136fde3fc57e	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2556-70c3-b819-17dcf2f44ba4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea831-0877-70c3-9cec-fe6aec64fc14	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2558-73d4-888e-cead5deb804a	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea834-0669-7318-b416-71145e18ced4	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-255a-7178-afcb-1fb27cb80508	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea836-b0a1-7133-b156-a3beb07cf0c5	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-255d-7161-bd78-2e1abd7347b4	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea819-1116-71ea-9acb-cbcfe56d5cd2	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-255f-71c7-bc65-cae9edbaf6e3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea838-7cad-726a-9d1b-c61c6bc5de1b	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2561-7197-b46e-00765a50ad0f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83a-2946-719a-8889-2b401be44dce	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2563-7104-8cad-feecc506501e	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83c-cd1e-7115-a782-580ff6e2df46	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2567-7067-bc1e-1934d22125fa	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea842-10e2-72c5-bdeb-78f4ef5a8c80	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-256a-73a1-8e2a-cc8f7264e872	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea844-708b-716e-98e6-435f82f93d85	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-256c-72c7-b4b6-8e586636e6e0	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea84c-3458-70d4-bedc-aeb19042d3f9	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-256e-735e-b253-c9c00e31bbbe	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea850-29b1-71d9-8551-ae5b81c9bb6c	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2570-70e6-81ee-a6effb82b99d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea861-418d-7150-bbb4-5533b73d7504	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2574-70c1-b8f4-44839cca45a3	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea864-2543-735f-b20b-7b5ef3587806	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2577-72c8-97f8-31bf9317748d	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea866-aa14-73b7-8700-129ad6212b27	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2578-7065-a166-a0310dd8e765	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea868-326a-7070-9bad-eb4e471c674b	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-257d-71bd-ba39-f9cb751dae9f	019dd037-5f2d-7108-a5ea-6e5596a9e177	019efff0-a100-7079-958e-eff405049f6e	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2587-71dc-a053-79851a05d6b6	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f23f2-a3ce-7373-a015-7f7b20e51e2a	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-258a-731b-8af4-a66f98458313	019dd037-5f2d-7108-a5ea-6e5596a9e177	019f3882-5836-702a-8f3a-e31bfe5a8392	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-258e-7329-8bb6-6dd490e9584a	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a034bb-d2df-70fc-ba01-d309f32df657	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2590-7021-a73a-4139d2e45b14	019dd037-5f2d-7108-a5ea-6e5596a9e177	01a0449d-87ed-7162-994a-1027af7499a0	2026-10-15	f	\N	2026-10-15 13:57:16	2026-10-15 13:57:16	\N
01a1407f-2543-725d-b3ed-23f6ed57e05b	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea81c-6801-73a4-8653-f5731c5af8e6	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 14:22:06	\N
01a1407f-2548-7084-a4f5-8cc2fdec3ead	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea821-6dea-7360-8e42-2c077c73ee89	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 14:22:06	\N
01a1407f-2565-724f-a3d4-106d8843fc57	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea83f-cf39-714e-aed5-16c0bf443a0d	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 14:22:06	\N
01a1407f-2572-7269-9985-f914c35b9abc	019dd037-5f2d-7108-a5ea-6e5596a9e177	019ea862-9946-724c-948d-3feef389c611	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 14:22:06	\N
01a1407f-258c-71a0-9741-0d51fa9d378c	019dd037-5f2d-7108-a5ea-6e5596a9e177	019fc8b1-9e40-7258-bc42-6c5502e495b7	2026-10-15	t	\N	2026-10-15 13:57:16	2026-10-15 14:22:06	\N
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.documents (id, title, description, category, file_path, file_original_name, file_type, is_published, published_at, user_id, created_at, updated_at, deleted_at) FROM stdin;
019e4eb8-5e81-7397-a848-b4a3cb3e856b	Teste documnento 40mb	\N	Outros	documents/pjO1vIRhs0RgQTN1WBtqQgRoOANBq3RAZnCdE6Ae.pdf	Edição-2024-–-Anais-da-Mostra-Científica-Cultural-e-Tecnológica_Versão-Final.pdf	PDF	f	\N	019dd037-5efb-7350-80d1-e05e9ff6a8fb	2026-05-22 05:06:06	2026-05-22 05:29:27	2026-05-22 05:29:27
019e46e4-8d46-7389-9193-d4d8f1e2bd17	Foto teste	\N	Outros	documents/U8uoMsmSdZs2NVUz0mUutF4vpKE6mJ2eHD9ze8XU.jpg	molde-de-coracao-pequeno-9-706x1024.jpg	JPG	f	\N	019dd037-5efb-7350-80d1-e05e9ff6a8fb	2026-05-20 16:37:24	2026-05-22 05:29:34	2026-05-22 05:29:34
019e46e7-cd78-72db-8593-e57998cf4d61	documento teste	\N	Outros	documents/9kkRwjbkEZDmslhxpWdKdDddpJ2Mb2vJ0AugcaVe.pdf	identificacao qdc.pdf	PDF	f	\N	019dd037-5efb-7350-80d1-e05e9ff6a8fb	2026-05-20 16:40:57	2026-05-22 05:29:36	2026-05-22 05:29:36
019e46ec-dd8d-724c-b61c-550e74e2ee74	Fotos	\N	Outros	documents/U1bhrWLMR66lc7Rmx9HRyJRf97kmhHrNL1sfDfUj.png	Documento A4 Tag Feliz dia das mães ilustrado Rosa e Branco.png	PNG	f	\N	019dd037-5efb-7350-80d1-e05e9ff6a8fb	2026-05-20 16:46:28	2026-05-22 05:29:38	2026-05-22 05:29:38
019e4f34-304b-72f6-ae25-4d395649653e	Teste	\N	Outros	documents/ZqC9b1goJnBHRepoCmqoJzGTv2FGUBpq0SgBGVi8.pdf	Edição-2024-–-Anais-da-Mostra-Científica-Cultural-e-Tecnológica_Versão-Final.pdf	PDF	f	\N	019dd037-5efb-7350-80d1-e05e9ff6a8fb	2026-05-22 07:21:20	2026-05-22 08:49:21	2026-05-22 08:49:21
019e4f4d-079c-709d-a6d4-abbda12ce2fd	testew	\N	CMI	documents/2iwyz94oWT7KhS6kJdIx06d6x8fPzlq4b6v0jfKX.png	carbon.png	PNG	f	\N	019dd037-5efb-7350-80d1-e05e9ff6a8fb	2026-05-22 07:48:28	2026-05-22 08:49:23	2026-05-22 08:49:23
019e4f85-13f9-724f-afa2-f8f927bc692d	Teste	\N	Outros	documents/ClIrEtY2Z0QeJGOBIcNMgqTVhXx2nKKxeSgF025S.pdf	Edição-2024-–-Anais-da-Mostra-Científica-Cultural-e-Tecnológica_Versão-Final.pdf	PDF	f	\N	019dd037-5efb-7350-80d1-e05e9ff6a8fb	2026-05-22 08:49:42	2026-05-22 09:17:57	2026-05-22 09:17:57
019e4fab-a13b-706e-9d4b-34da6a273e11	Teste	\N	Outros	documents/zpdV1RTxs48P0vK5b21wUQ2IyXgWDa9DZuNLDiUy.png	carbon.png	PNG	f	\N	019dd037-5efb-7350-80d1-e05e9ff6a8fb	2026-05-22 09:31:48	2026-08-27 17:11:32	2026-08-27 17:11:32
01a044d9-4ef9-7052-aaf7-7381e69c17cf	ATA 2026-2028	\N	Atas	documents/XBREReHANRkcPCHWBWfG3DK47OYRaRZJm8dQly1V.pdf	ATA 2026-2028.pdf	PDF	f	\N	019dd037-5efb-7350-80d1-e05e9ff6a8fb	2026-08-27 17:11:27	2026-08-27 17:11:34	\N
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2025_01_01_000000_create_documents_table	1
5	2026_04_11_011616_create_activities_table	1
6	2026_04_11_150736_create_participants_table	1
7	2026_04_11_150741_create_participant_filiations_table	1
8	2026_04_11_150741_create_participant_schools_table	1
9	2026_04_11_150742_create_participant_authorizations_table	1
10	2026_04_11_150742_create_participant_guardians_table	1
11	2026_04_11_150743_create_participant_family_members_table	1
12	2026_04_11_150746_create_participant_housings_table	1
13	2026_04_11_150747_create_participant_health_table	1
14	2026_04_11_150748_create_activity_participant_table	1
15	2026_04_11_150748_create_participant_observations_table	1
16	2026_04_11_160000_create_attendances_table	1
17	2026_04_28_220238_enable_pg_trgm_extension	2
18	2026_04_28_220247_add_fulltext_indices_to_documents_and_participants	2
19	2026_04_28_222223_add_trgm_index_to_activities_table	2
20	2026_04_28_222736_enable_unaccent_extension	2
21	2026_04_28_222740_create_immutable_unaccent_function	2
22	2026_04_28_222758_update_trgm_indices_to_use_unaccent	2
23	2026_04_28_230925_add_trgm_index_to_users_table	2
24	2026_06_08_180135_fix_participant_cpf_unique_constraint	3
\.


--
-- Data for Name: participant_authorizations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participant_authorizations (id, participant_id, can_leave_alone, authorized_name, authorized_bond, authorized_phone, document_path, created_at, updated_at, deleted_at) FROM stdin;
019eaabc-3005-71ec-a541-67c0826240ed	019ea894-9707-71dd-9448-f213e631ac55	f	\N	\N	\N	\N	2026-06-09 01:55:20	2026-06-09 01:55:20	\N
019ead93-1a5d-70ff-849c-dfe99a8ce5a6	019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	f	\N	\N	\N	\N	2026-06-09 15:09:19	2026-06-09 15:09:19	\N
019eaf18-2c40-71b0-84cd-187f286af4e3	019ea83c-cd1e-7115-a782-580ff6e2df46	f	\N	\N	\N	\N	2026-06-09 22:14:17	2026-06-09 22:14:17	\N
019efff0-a150-72ac-93d9-40a01f568134	019efff0-a100-7079-958e-eff405049f6e	f	\N	\N	\N	\N	2026-06-25 15:00:20	2026-06-25 15:00:20	\N
019f23cf-d286-7383-a671-e9a7b32bb7fc	019f23cf-d26e-72e4-a177-4aa236ea8020	f	\N	\N	\N	\N	2026-07-02 14:10:50	2026-07-02 14:10:50	\N
019f23d2-0f7c-70ad-af1d-d91abeddef84	019f23d2-0f65-72c1-b310-f08055930c63	f	\N	\N	\N	\N	2026-07-02 14:13:16	2026-07-02 14:13:16	\N
019f23d4-b355-702f-a1a3-27d36c906f8d	019f23d4-b33e-7017-9c6c-1e52905168dc	f	\N	\N	\N	\N	2026-07-02 14:16:09	2026-07-02 14:16:09	\N
019f23d6-29be-72e1-b73d-6c88e29138bc	019f23d6-29ab-73f7-ae5f-6bb340ad0b01	f	\N	\N	\N	\N	2026-07-02 14:17:45	2026-07-02 14:17:45	\N
019f23d8-78f4-7284-a4f0-f4c46d0a55ed	019f23d8-78d0-72c9-bbce-9977a6845797	f	\N	\N	\N	\N	2026-07-02 14:20:17	2026-07-02 14:20:17	\N
019f23da-5b7d-73af-9b5e-a2b7aa1a6b0d	019f23da-5b6b-7138-a534-7bd65a738ab9	f	\N	\N	\N	\N	2026-07-02 14:22:20	2026-07-02 14:22:20	\N
019f23dc-145f-71e4-a34a-29ba1370e8f8	019f23dc-1445-72de-8c78-c1b27fa4987f	f	\N	\N	\N	\N	2026-07-02 14:24:13	2026-07-02 14:24:13	\N
019f23dd-dce2-73b4-a85c-68a6c0053dfe	019f23dd-dccd-7011-82e6-090a2eb2f684	f	\N	\N	\N	\N	2026-07-02 14:26:10	2026-07-02 14:26:10	\N
019f23df-7a28-715d-94b5-533cc8c6d03f	019f23df-7a16-71c4-972a-55fa6cd94199	f	\N	\N	\N	\N	2026-07-02 14:27:56	2026-07-02 14:27:56	\N
019f23e1-9a8d-72d6-9700-b49b0f1e86b4	019f23e1-9a76-73e7-975b-b6f978a9ef40	f	\N	\N	\N	\N	2026-07-02 14:30:15	2026-07-02 14:30:15	\N
019f23e3-21cb-73c2-947a-bfec7ecbfc68	019f23e3-21b9-702d-9b9b-2ad7c4316d7d	f	\N	\N	\N	\N	2026-07-02 14:31:55	2026-07-02 14:31:55	\N
019f23e5-dbab-730d-97c3-1de17fe8a45a	019f23e5-db97-72a5-8029-abfa9f328ed5	f	\N	\N	\N	\N	2026-07-02 14:34:54	2026-07-02 14:34:54	\N
019f23ed-100e-73e3-9b37-20e27e7a1115	019f23ed-0ff6-71cf-a6ca-fe8b37735aa2	f	\N	\N	\N	\N	2026-07-02 14:42:46	2026-07-02 14:42:46	\N
019f23ef-1308-7353-a52d-3a9169c5c70d	019f23ef-12f2-73d4-8239-258c964bd778	f	\N	\N	\N	\N	2026-07-02 14:44:58	2026-07-02 14:44:58	\N
019f23ef-9afe-73cb-8e5e-3e90d0947aa8	019f23ef-9aec-703d-b404-c6f70cc7fd60	f	\N	\N	\N	\N	2026-07-02 14:45:33	2026-07-02 14:45:55	2026-07-02 14:45:55
019f23f2-a3e6-73c3-b431-487a7b36a84a	019f23f2-a3ce-7373-a015-7f7b20e51e2a	f	\N	\N	\N	\N	2026-07-02 14:48:52	2026-07-02 14:48:52	\N
019f23f4-b7ee-7335-a836-40694f5074eb	019f23f4-b7da-7012-890b-794942d0af42	f	\N	\N	\N	\N	2026-07-02 14:51:08	2026-07-02 14:51:08	\N
019f23f6-282f-73de-82a7-2f72c66f3408	019f23f6-281b-73cd-b1d0-420531076382	f	\N	\N	\N	\N	2026-07-02 14:52:42	2026-07-02 14:52:42	\N
019f23fc-6a0f-71bf-97d3-a5f9f74ee8fa	019f23fc-69f6-72f2-a0de-0cd9261fd295	f	\N	\N	\N	\N	2026-07-02 14:59:32	2026-07-02 14:59:32	\N
019f23fe-aae3-72f8-a4d1-3f9036ab4700	019f23fe-aac7-7165-88a1-789edb82ede3	f	\N	\N	\N	\N	2026-07-02 15:02:00	2026-07-02 15:02:00	\N
019f2404-794d-726b-9474-7e1d18abea71	019f2404-7939-7034-931f-46ad4c880cd9	f	\N	\N	\N	\N	2026-07-02 15:08:20	2026-07-02 15:08:20	\N
019f2406-03e7-7320-a31c-c3499ced5778	019f2406-03ca-731e-b4e7-d959d8162ccb	f	\N	\N	\N	\N	2026-07-02 15:10:01	2026-07-02 15:10:01	\N
019f2408-7948-713c-939f-10c97cdb3fdd	019f2408-7937-7124-9e26-c742ab05af5f	f	\N	\N	\N	\N	2026-07-02 15:12:42	2026-07-02 15:12:42	\N
019f240a-74c8-706a-a560-3dd36e601695	019f240a-74af-73dd-857a-149822fe001b	f	\N	\N	\N	\N	2026-07-02 15:14:52	2026-07-02 15:14:52	\N
019f240d-c828-7086-b506-1449b047d143	019f240d-c80e-72b7-b56f-ef5b303a29aa	f	\N	\N	\N	\N	2026-07-02 15:18:30	2026-07-02 15:18:30	\N
019f240e-f9a5-7126-aec5-acc18e180b75	019f240e-f987-7154-9fd2-ee9f250e384b	f	\N	\N	\N	\N	2026-07-02 15:19:49	2026-07-02 15:19:49	\N
019f241c-e561-726a-8ad7-2ca0544c6982	019f241c-e4e8-713d-9331-4cb794c1a10c	f	\N	\N	\N	\N	2026-07-02 15:35:01	2026-07-02 15:35:01	\N
019f241f-9df2-7375-ac68-e9bdfdd94f9e	019f241f-9dcf-703f-a8cc-82faa1c4a5a7	f	\N	\N	\N	\N	2026-07-02 15:37:59	2026-07-02 15:37:59	\N
019f2421-7c6e-73db-b302-ef3cd2df5322	019f2421-7c56-7289-8831-099c868282db	f	\N	\N	\N	\N	2026-07-02 15:40:02	2026-07-02 15:40:02	\N
019f2423-b001-7375-ab89-9b708a6e8e85	019f2423-afe8-7058-a7dd-f11789ebd598	f	\N	\N	\N	\N	2026-07-02 15:42:26	2026-07-02 15:42:26	\N
019f2425-4a87-7395-b558-e44c3eccd5ef	019f2425-4a62-71b3-9f4d-fd22768cfc12	f	\N	\N	\N	\N	2026-07-02 15:44:11	2026-07-02 15:44:11	\N
019f2426-977f-71a6-b481-fff0ddff52fd	019f2426-976a-73bc-8feb-fb033192f832	f	\N	\N	\N	\N	2026-07-02 15:45:36	2026-07-02 15:45:36	\N
019f2427-8741-7107-8ff9-52f182ab964f	019f2427-8730-713b-aa9b-320ce0d3342e	f	\N	\N	\N	\N	2026-07-02 15:46:38	2026-07-02 15:46:38	\N
019f2428-cfaa-73ea-b31d-3d41a3ffa610	019f2428-cf58-72cb-9d4d-5d4b255c329f	f	\N	\N	\N	\N	2026-07-02 15:48:02	2026-07-02 15:48:02	\N
019f2429-89c5-70f8-85f3-136a87576473	019f2429-89ad-716b-b1ec-3fbdb7f96ba2	f	\N	\N	\N	\N	2026-07-02 15:48:49	2026-07-02 15:48:49	\N
019f242a-f883-7244-acb2-4dd75bd8bc01	019f242a-f86f-70ff-9c6e-c80dc9a3ef76	f	\N	\N	\N	\N	2026-07-02 15:50:23	2026-07-02 15:50:23	\N
019f242d-9665-7370-bfb2-d419db2fa567	019f242d-9652-70eb-b7f5-9d6ed25bdce3	f	\N	\N	\N	\N	2026-07-02 15:53:15	2026-07-02 15:53:15	\N
019f242f-283d-73fe-a19d-546811a2f1d4	019f242f-282a-7079-a7d7-a80727513a91	f	\N	\N	\N	\N	2026-07-02 15:54:58	2026-07-02 15:54:58	\N
019f2430-b0d8-72c9-a45c-fb7424591966	019f2430-b0a5-7168-99e2-09976a758ec7	f	\N	\N	\N	\N	2026-07-02 15:56:38	2026-07-02 15:56:38	\N
019f2433-82f3-70a3-bd9c-60eece07421c	019f2433-82e1-72dd-b6b4-8bc045fd7576	f	\N	\N	\N	\N	2026-07-02 15:59:43	2026-07-02 15:59:43	\N
019f2434-6f7b-72f2-959d-823576e467d0	019f2434-6f67-7332-8c69-ace3defb4a53	f	\N	\N	\N	\N	2026-07-02 16:00:44	2026-07-02 16:00:44	\N
019f2435-80da-7098-a365-579b871b6210	019f2435-80b5-70be-ab51-c221666b406e	f	\N	\N	\N	\N	2026-07-02 16:01:54	2026-07-02 16:01:54	\N
019f2436-ff26-700b-94c7-e8d71662dd42	019f2436-fefc-7357-950c-f69baadedaef	f	\N	\N	\N	\N	2026-07-02 16:03:31	2026-07-02 16:03:31	\N
019f2438-0e74-72c6-bdc3-11caa371d0e6	019f2438-0e60-7065-958b-8abb179113aa	f	\N	\N	\N	\N	2026-07-02 16:04:41	2026-07-02 16:04:41	\N
019f2439-2966-705f-b7ed-b23f9f9555f7	019f2439-2956-72a4-9af9-146653403346	f	\N	\N	\N	\N	2026-07-02 16:05:53	2026-07-02 16:05:53	\N
019f243a-58ca-724d-9a2a-42ac1e93b5ce	019f243a-58b2-733b-b14a-c57263f12319	f	\N	\N	\N	\N	2026-07-02 16:07:11	2026-07-02 16:07:11	\N
019f243b-6e9d-70e0-91ba-b3772276e777	019f243b-6e89-71a8-aeb0-a23061a21981	f	\N	\N	\N	\N	2026-07-02 16:08:22	2026-07-02 16:08:22	\N
019f243c-5469-7310-8053-2f5cd5722b93	019f243c-5459-7395-85e8-00bdb60348d5	f	\N	\N	\N	\N	2026-07-02 16:09:21	2026-07-02 16:09:21	\N
019f243e-7d11-72e5-98cc-eea744f0a37f	019f243e-7cf8-729a-8105-6fc7c7eeb656	f	\N	\N	\N	\N	2026-07-02 16:11:42	2026-07-02 16:11:42	\N
019f243f-b482-724e-9e48-fc39ddfe1679	019f243f-b46d-737f-b478-99d82ec8f5c0	f	\N	\N	\N	\N	2026-07-02 16:13:02	2026-07-02 16:13:02	\N
019f246e-b8d8-7002-af8a-eb56cb3f0cb9	019f246e-b89c-7370-9d32-c18d1f44ed20	t	\N	\N	\N	participants/documents/0r0AVgHnv0Nregfp7LsnXaJCsYMTicXPvRV1fmOn.pdf	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f2467-9bb1-705f-8a30-fd8891550396	019f2467-9b5c-7175-a77e-a718ede6b1a7	t	\N	\N	\N	participants/documents/RUIyPttzO0TetJO1q4OieJ4JtQwzqqhb7ezkKADi.pdf	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f248e-baba-73cd-9da6-7fe05b6ae642	019f248e-baa6-7148-9db4-d3d468da4a95	f	\N	\N	\N	\N	2026-07-02 17:39:21	2026-07-02 17:39:21	\N
019f2495-d8d7-714e-9b67-d66351b2501c	019f2495-d8be-7284-a9d4-1e72bda0ca2d	f	\N	\N	\N	\N	2026-07-02 17:47:07	2026-07-02 17:47:07	\N
019f298b-dd7f-70fe-9bfa-905db467715e	019f298b-dd42-72da-a454-ba7943289e0c	f	Vinicius e Priscilla	Mãe e Pai	\N	participants/documents/f9eYJZwH0wblNUKwzbu4XpyTuKT0ZF0nj4D4bIAd.pdf	2026-07-03 16:54:19	2026-07-03 16:54:19	\N
019f3882-5868-7347-b4d2-8e637944a4d8	019f3882-5836-702a-8f3a-e31bfe5a8392	f	\N	\N	\N	\N	2026-07-06 14:38:14	2026-07-06 14:38:14	\N
019fc8b1-9e79-722a-bebb-b80cd5de3e11	019fc8b1-9e40-7258-bc42-6c5502e495b7	f	\N	\N	\N	\N	2026-08-03 14:35:11	2026-08-03 14:35:11	\N
019fdd22-e159-72d5-817b-d57cfe06c8b3	019fdd22-e121-7093-8603-1c5da640d3b9	t	\N	\N	\N	participants/documents/yoVYGRwYmBIin4qhW8kwHrazgMKdiOUFBEXJa2r6.pdf	2026-08-07 13:51:18	2026-08-07 13:51:18	\N
01a0166a-03c9-731d-8868-7d69a8732dac	01a0166a-0339-700d-9eb9-519b80b05c1b	f	\N	\N	\N	participants/documents/5xFWRrMCYXVY39vLXNyIV3EOElqRDOLtoTkrn7mQ.pdf	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a034bb-d32d-72fb-afd6-d734c1fa3ad4	01a034bb-d2df-70fc-ba01-d309f32df657	f	\N	\N	\N	\N	2026-08-24 14:05:19	2026-08-24 14:05:19	\N
01a04451-04a7-7081-a041-58e69fc55627	01a04451-046d-725f-a23c-fad397c4b95c	f	\N	\N	\N	participants/documents/8OBraDIfpTAPquTpSflektOmucsiMPGEnez8yBD8.pdf	2026-08-27 14:42:35	2026-08-27 15:02:21	\N
01a04445-f3d7-712d-ae88-f24cbd3bc419	01a04445-f3c5-7234-baad-000c79bc9a6b	f	\N	\N	\N	participants/documents/otRv76KGNeto9s1nh8cp6vD21fy52REgeiM3R3eL.pdf	2026-08-27 14:30:30	2026-08-27 15:06:19	\N
01a0443f-836c-7264-8339-4cd8ff5b0974	01a0443f-8330-7233-ad2d-ade67d6262d5	f	\N	\N	\N	participants/documents/Uk7zvKYYzJHY7fReN4cp4QWyApjf0NWISYxNuzEs.pdf	2026-08-27 14:23:28	2026-08-27 15:08:33	\N
01a0449d-896d-7342-aa51-46e53dfb093a	01a0449d-87ed-7162-994a-1027af7499a0	f	\N	\N	\N	\N	2026-08-27 16:06:10	2026-08-27 16:06:10	\N
01a0b563-5459-73f6-9025-2c57d78813bf	01a0b563-5427-723a-812a-0f175368a841	f	\N	\N	\N	participants/documents/ObIhjFGZv4DcwMYF4VdxLUjPKqrTxZL3zZKTmf3V.pdf	2026-09-18 13:39:40	2026-09-18 13:39:40	\N
01a0b55f-d568-7182-bd60-8abf8fa71708	01a0b55f-d535-7259-9c00-4a8ef2486221	f	\N	\N	\N	\N	2026-09-18 13:35:51	2026-09-18 13:40:08	2026-09-18 13:40:08
01a0d954-e904-7081-9b6f-6fb4c55bbd39	01a0d954-e883-720d-b7ea-3e68db80d027	t	\N	\N	\N	participants/documents/dJY36XXOVQFOFr6zHPoydl8f8SxvbFMbtT192pSM.pdf	2026-09-25 13:10:15	2026-09-25 13:10:15	\N
01a0da50-205e-71a4-9e48-b1eeaea4020c	01a0da50-2002-7370-87c4-2a6b32841190	t	\N	\N	\N	participants/documents/fnsKV45LngjwvMdZ4kZ5UeEJkvTOSqQz6VOn9zzs.pdf	2026-09-25 17:44:39	2026-09-25 17:44:39	\N
01a10dc0-d8ed-7088-a857-2ebcb26e85b6	01a10dc0-d890-73a0-9107-98fd25a324ef	f	\N	\N	\N	participants/documents/GBIgPPRoFSmLxIGOMfkE8YzdrnFu9wwOw9WPKUkd.pdf	2026-10-05 17:28:24	2026-10-05 17:28:24	\N
01a12207-d5c8-7016-8434-ed84065a8b85	01a12207-d572-7227-a89e-9f11da7b3920	f	\N	\N	\N	participants/documents/3doFXt9KueJuTgIt53eM1wpwTfEVHF9vvLlMgwed.pdf	2026-10-09 15:58:21	2026-10-09 15:58:21	\N
01a155ae-6772-73ce-bab1-6e352795ef85	01a155ae-66e2-718d-bbe7-f70fac829f36	f	Eduardo Dornelas	Irmão	11978233552	participants/documents/l7sPGykKDiI2FkEU4rGbZsVfdd5hGxihMtBtO6iZ.pdf	2026-10-19 16:40:55	2026-10-19 16:40:55	\N
01a13673-e1dc-7103-addc-fa1468ed5a97	01a13673-e182-70e4-b8d5-b9832d4783ca	f	STEFANI TIA --	LUANA	18988229615	participants/documents/5hLRnyq1KsPuilMiTPxkZOjMr0NULE7hnLLjG17a.pdf	2026-10-13 15:08:46	2026-10-13 15:26:49	\N
\.


--
-- Data for Name: participant_family_members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participant_family_members (id, participant_id, name, relationship, age, profession, income, created_at, updated_at, deleted_at) FROM stdin;
019eaf18-2c48-70d9-bcd8-e265b80e9d79	019ea83c-cd1e-7115-a782-580ff6e2df46	asd	Mãe	12	gdf	456456	2026-06-09 22:14:17	2026-06-09 22:14:27	2026-06-09 22:14:27
019f246e-b8e1-73c9-aab5-085f96874de1	019f246e-b89c-7370-9d32-c18d1f44ed20	Isabelina Gonzalez Benitez	Mãe	36	Dona de casa	80000	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f246e-b8e2-71bf-ad71-ecfe10173e0b	019f246e-b89c-7370-9d32-c18d1f44ed20	Rudson Vizache Gonzalez	Outro	2	\N	0	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f246e-b8e3-7363-89bd-af3d36072749	019f246e-b89c-7370-9d32-c18d1f44ed20	Hugo Javier Delvalle Gonzalez	Outro	9	\N	0	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f2467-9bb5-73d0-aaea-9987b807d2f1	019f2467-9b5c-7175-a77e-a718ede6b1a7	Hugo Javier Delvalle Gonzalez	Outro	9	\N	0	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f2467-9bb7-72b0-90ff-e97b9ed87eae	019f2467-9b5c-7175-a77e-a718ede6b1a7	Isabelina Gonzalez Benitez	Mãe	36	Dona de casa	80000	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f2467-9bb7-72b0-90ff-e97b9f1c5292	019f2467-9b5c-7175-a77e-a718ede6b1a7	Rudson Vizache Gonzalez	Irmão	2	\N	0	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f298e-bf7f-7383-8149-b6065cf38bd7	019f298b-dd42-72da-a454-ba7943289e0c	Heitor Gomes Bezerra	Outro	10	\N	0	2026-07-03 16:57:28	2026-07-03 16:57:55	2026-07-03 16:57:55
019f298e-bf81-7206-899f-43d80fe60924	019f298b-dd42-72da-a454-ba7943289e0c	Cecilia Gomes Bezerra	Irmã	6	\N	0	2026-07-03 16:57:28	2026-07-03 16:57:55	2026-07-03 16:57:55
019f298e-bf82-729f-9b5c-3ddaac449e46	019f298b-dd42-72da-a454-ba7943289e0c	Vinicius Santana Bezerra	Pai	37	Técnico em contabilidade	0	2026-07-03 16:57:28	2026-07-03 16:57:55	2026-07-03 16:57:55
019f298e-bf82-729f-9b5c-3ddaace7543e	019f298b-dd42-72da-a454-ba7943289e0c	Priscilla Gomes de Araújo	Mãe	37	Agente de organização escolar	0	2026-07-03 16:57:28	2026-07-03 16:57:55	2026-07-03 16:57:55
019f298f-2937-7064-b000-057393b7573f	019f298b-dd42-72da-a454-ba7943289e0c	Heitor Gomes Bezerra	Outro	10	\N	0	2026-07-03 16:57:55	2026-07-03 16:57:55	\N
019f298f-2938-713d-8620-35e221324a6d	019f298b-dd42-72da-a454-ba7943289e0c	Cecilia Gomes Bezerra	Irmã	6	\N	0	2026-07-03 16:57:55	2026-07-03 16:57:55	\N
019f298f-293a-7391-8610-b2ae74099f32	019f298b-dd42-72da-a454-ba7943289e0c	Vinicius Santana Bezerra	Pai	37	Técnico em contabilidade	0	2026-07-03 16:57:55	2026-07-03 16:57:55	\N
019f298f-293d-726c-ad2e-421afd5e082b	019f298b-dd42-72da-a454-ba7943289e0c	Priscilla Gomes de Araújo	Mãe	37	Agente de organização escolar	0	2026-07-03 16:57:55	2026-07-03 16:57:55	\N
019fdd22-e164-735b-b440-e3a2c56a7c38	019fdd22-e121-7093-8603-1c5da640d3b9	Thays	Mãe	\N	Fape	0	2026-08-07 13:51:18	2026-08-07 13:52:12	2026-08-07 13:52:12
019fdd22-e165-7267-a52d-e375c94a29f5	019fdd22-e121-7093-8603-1c5da640d3b9	Enzzo	Outro	\N	\N	0	2026-08-07 13:51:18	2026-08-07 13:52:12	2026-08-07 13:52:12
019fdd22-e166-72c4-a6ef-726df9df9070	019fdd22-e121-7093-8603-1c5da640d3b9	Nycolas Ryan Ramos	\N	\N	\N	0	2026-08-07 13:51:18	2026-08-07 13:52:12	2026-08-07 13:52:12
019fdd22-e167-7345-b782-e92c901b567d	019fdd22-e121-7093-8603-1c5da640d3b9	Regina Lucilene Silva	Avó	\N	\N	0	2026-08-07 13:51:18	2026-08-07 13:52:12	2026-08-07 13:52:12
019fdd23-b34c-70b9-8621-89eb7ef447a7	019fdd22-e121-7093-8603-1c5da640d3b9	Thays	Mãe	\N	Fape	0	2026-08-07 13:52:12	2026-08-07 13:52:12	\N
019fdd23-b34d-7028-bb86-8afc3e4fc339	019fdd22-e121-7093-8603-1c5da640d3b9	Enzzo	Outro	\N	\N	0	2026-08-07 13:52:12	2026-08-07 13:52:12	\N
019fdd23-b34e-71a0-a499-e2f989ef78ae	019fdd22-e121-7093-8603-1c5da640d3b9	Nycolas Ryan Ramos	\N	\N	\N	0	2026-08-07 13:52:12	2026-08-07 13:52:12	\N
019fdd23-b34f-7387-8103-feb68910ba3f	019fdd22-e121-7093-8603-1c5da640d3b9	Regina Lucilene Silva	Avó	\N	\N	0	2026-08-07 13:52:12	2026-08-07 13:52:12	\N
01a0166a-03d6-72ff-b8f2-8042872989e8	01a0166a-0339-700d-9eb9-519b80b05c1b	Tabata Eugenia Melo	Mãe	32	Autônoma	0	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a0166a-03d9-72aa-9e0d-24a8945e595a	01a0166a-0339-700d-9eb9-519b80b05c1b	Lucas Melo	Irmão	2	\N	0	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a0166a-03da-7114-a421-773cbc1b3519	01a0166a-0339-700d-9eb9-519b80b05c1b	Antonio Carlos	Pai	41	Serviços gerais	162100	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a034bb-d33a-73fe-b1fb-4f582b9512c4	01a034bb-d2df-70fc-ba01-d309f32df657	Sirley Maria Paiva	\N	\N	\N	0	2026-08-24 14:05:19	2026-08-24 14:05:19	\N
\.


--
-- Data for Name: participant_filiations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participant_filiations (id, participant_id, mother_name, mother_phone, mother_workplace, father_name, father_phone, father_workplace, created_at, updated_at, deleted_at) FROM stdin;
019eaabc-2ff7-7054-83ad-8db0a30ecea5	019ea894-9707-71dd-9448-f213e631ac55	\N	\N	\N	\N	\N	\N	2026-06-09 01:55:20	2026-06-09 01:55:20	\N
019ead93-1a4b-7185-8bce-cf7b0baf5480	019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	\N	\N	\N	\N	\N	\N	2026-06-09 15:09:19	2026-06-09 15:09:19	\N
019eaf18-2c34-700f-8ae0-e6d6b2200cef	019ea83c-cd1e-7115-a782-580ff6e2df46	\N	\N	\N	\N	\N	\N	2026-06-09 22:14:17	2026-06-09 22:14:17	\N
019efff0-a143-71a5-9c1e-e0c1ca755c57	019efff0-a100-7079-958e-eff405049f6e	\N	\N	\N	\N	\N	\N	2026-06-25 15:00:20	2026-06-25 15:00:20	\N
019f23cf-d27a-7099-b498-fed5d1f35425	019f23cf-d26e-72e4-a177-4aa236ea8020	\N	\N	\N	\N	\N	\N	2026-07-02 14:10:50	2026-07-02 14:10:50	\N
019f23d2-0f71-7334-8d3f-ddc2d457adc0	019f23d2-0f65-72c1-b310-f08055930c63	\N	\N	\N	\N	\N	\N	2026-07-02 14:13:16	2026-07-02 14:13:16	\N
019f23d4-b348-72f8-8307-888fa50c4e09	019f23d4-b33e-7017-9c6c-1e52905168dc	\N	\N	\N	\N	\N	\N	2026-07-02 14:16:09	2026-07-02 14:16:09	\N
019f23d6-29b5-70d1-8084-d89f777ef13d	019f23d6-29ab-73f7-ae5f-6bb340ad0b01	\N	\N	\N	\N	\N	\N	2026-07-02 14:17:45	2026-07-02 14:17:45	\N
019f23d8-78e3-73d4-8552-f370bd3c63c5	019f23d8-78d0-72c9-bbce-9977a6845797	\N	\N	\N	\N	\N	\N	2026-07-02 14:20:17	2026-07-02 14:20:17	\N
019f23da-5b75-7299-ac2e-1a051fc3e07c	019f23da-5b6b-7138-a534-7bd65a738ab9	\N	\N	\N	\N	\N	\N	2026-07-02 14:22:20	2026-07-02 14:22:20	\N
019f23dc-1454-721c-8dc7-a89988e3c573	019f23dc-1445-72de-8c78-c1b27fa4987f	\N	\N	\N	\N	\N	\N	2026-07-02 14:24:13	2026-07-02 14:24:13	\N
019f23dd-dcd8-730c-8f4e-c2a90f4cc9f8	019f23dd-dccd-7011-82e6-090a2eb2f684	\N	\N	\N	\N	\N	\N	2026-07-02 14:26:10	2026-07-02 14:26:10	\N
019f23df-7a1f-725e-91fd-180764e49f16	019f23df-7a16-71c4-972a-55fa6cd94199	\N	\N	\N	\N	\N	\N	2026-07-02 14:27:56	2026-07-02 14:27:56	\N
019f23e1-9a82-734c-bb4c-4cc79ed1db1b	019f23e1-9a76-73e7-975b-b6f978a9ef40	\N	\N	\N	\N	\N	\N	2026-07-02 14:30:15	2026-07-02 14:30:15	\N
019f23e3-21c2-721d-85da-10431b746f0d	019f23e3-21b9-702d-9b9b-2ad7c4316d7d	\N	\N	\N	\N	\N	\N	2026-07-02 14:31:55	2026-07-02 14:31:55	\N
019f23e5-dba1-70b7-8c98-91ffe7c99ecb	019f23e5-db97-72a5-8029-abfa9f328ed5	\N	\N	\N	\N	\N	\N	2026-07-02 14:34:54	2026-07-02 14:34:54	\N
019f23ed-1006-73c2-a9c1-0398c236c03f	019f23ed-0ff6-71cf-a6ca-fe8b37735aa2	\N	\N	\N	\N	\N	\N	2026-07-02 14:42:46	2026-07-02 14:42:46	\N
019f23ef-12fe-7336-bf93-64e742a92cfe	019f23ef-12f2-73d4-8239-258c964bd778	\N	\N	\N	\N	\N	\N	2026-07-02 14:44:58	2026-07-02 14:44:58	\N
019f23ef-9af5-73d7-a7e5-ff7f98fd93a7	019f23ef-9aec-703d-b404-c6f70cc7fd60	\N	\N	\N	\N	\N	\N	2026-07-02 14:45:33	2026-07-02 14:45:55	2026-07-02 14:45:55
019f23f2-a3dc-71b4-90d6-363051385d28	019f23f2-a3ce-7373-a015-7f7b20e51e2a	\N	\N	\N	\N	\N	\N	2026-07-02 14:48:52	2026-07-02 14:48:52	\N
019f23f4-b7e4-70ff-b89f-717f59ebfb11	019f23f4-b7da-7012-890b-794942d0af42	\N	\N	\N	\N	\N	\N	2026-07-02 14:51:08	2026-07-02 14:51:08	\N
019f23f6-2825-7310-9160-f4cdcf40d498	019f23f6-281b-73cd-b1d0-420531076382	\N	\N	\N	\N	\N	\N	2026-07-02 14:52:42	2026-07-02 14:52:42	\N
019f23fc-6a06-7341-a6c5-ded9d1fddda6	019f23fc-69f6-72f2-a0de-0cd9261fd295	\N	\N	\N	\N	\N	\N	2026-07-02 14:59:32	2026-07-02 14:59:32	\N
019f23fe-aad7-7014-949d-7c738a854363	019f23fe-aac7-7165-88a1-789edb82ede3	\N	\N	\N	\N	\N	\N	2026-07-02 15:02:00	2026-07-02 15:02:00	\N
019f2404-7943-700b-8318-6d096a514829	019f2404-7939-7034-931f-46ad4c880cd9	\N	\N	\N	\N	\N	\N	2026-07-02 15:08:20	2026-07-02 15:08:20	\N
019f2406-03db-73f9-be14-860fbd773b08	019f2406-03ca-731e-b4e7-d959d8162ccb	\N	\N	\N	\N	\N	\N	2026-07-02 15:10:01	2026-07-02 15:10:01	\N
019f2408-7940-72ae-ab09-41d40fbb2f26	019f2408-7937-7124-9e26-c742ab05af5f	\N	\N	\N	\N	\N	\N	2026-07-02 15:12:42	2026-07-02 15:12:42	\N
019f240a-74bd-722c-a94c-46823c6c472e	019f240a-74af-73dd-857a-149822fe001b	\N	\N	\N	\N	\N	\N	2026-07-02 15:14:52	2026-07-02 15:14:52	\N
019f240d-c81c-71f1-8c41-d37539eb7eda	019f240d-c80e-72b7-b56f-ef5b303a29aa	\N	\N	\N	\N	\N	\N	2026-07-02 15:18:30	2026-07-02 15:18:30	\N
019f240e-f996-70e1-8dab-21410c431f87	019f240e-f987-7154-9fd2-ee9f250e384b	\N	\N	\N	\N	\N	\N	2026-07-02 15:19:49	2026-07-02 15:19:49	\N
019f241c-e513-733c-bc5d-c64b17cf64d4	019f241c-e4e8-713d-9331-4cb794c1a10c	\N	\N	\N	\N	\N	\N	2026-07-02 15:35:01	2026-07-02 15:35:01	\N
019f241f-9ddd-7053-9313-62e560dfa236	019f241f-9dcf-703f-a8cc-82faa1c4a5a7	\N	\N	\N	\N	\N	\N	2026-07-02 15:37:59	2026-07-02 15:37:59	\N
019f2421-7c63-7137-828d-14f5d14213e2	019f2421-7c56-7289-8831-099c868282db	\N	\N	\N	\N	\N	\N	2026-07-02 15:40:02	2026-07-02 15:40:02	\N
019f2423-aff3-73bf-9976-5a4cc3359863	019f2423-afe8-7058-a7dd-f11789ebd598	\N	\N	\N	\N	\N	\N	2026-07-02 15:42:26	2026-07-02 15:42:26	\N
019f2425-4a75-7066-8835-bd18b17c6b20	019f2425-4a62-71b3-9f4d-fd22768cfc12	\N	\N	\N	\N	\N	\N	2026-07-02 15:44:11	2026-07-02 15:44:11	\N
019f2426-9775-70c4-b84c-34c86f2cf0de	019f2426-976a-73bc-8feb-fb033192f832	\N	\N	\N	\N	\N	\N	2026-07-02 15:45:36	2026-07-02 15:45:36	\N
019f2427-8739-7173-9ffe-b45ab531a08a	019f2427-8730-713b-aa9b-320ce0d3342e	\N	\N	\N	\N	\N	\N	2026-07-02 15:46:38	2026-07-02 15:46:38	\N
019f2428-cf6f-7016-b646-338a8455e14c	019f2428-cf58-72cb-9d4d-5d4b255c329f	\N	\N	\N	\N	\N	\N	2026-07-02 15:48:02	2026-07-02 15:48:02	\N
019f2429-89ba-732b-9e91-5c9deb8812fc	019f2429-89ad-716b-b1ec-3fbdb7f96ba2	\N	\N	\N	\N	\N	\N	2026-07-02 15:48:49	2026-07-02 15:48:49	\N
019f242a-f87b-73b3-9ab6-e37174195a27	019f242a-f86f-70ff-9c6e-c80dc9a3ef76	\N	\N	\N	\N	\N	\N	2026-07-02 15:50:23	2026-07-02 15:50:23	\N
019f242d-965c-730a-aa34-f9d41d550643	019f242d-9652-70eb-b7f5-9d6ed25bdce3	\N	\N	\N	\N	\N	\N	2026-07-02 15:53:15	2026-07-02 15:53:15	\N
019f242f-2835-717e-a078-ef422e5b546d	019f242f-282a-7079-a7d7-a80727513a91	\N	\N	\N	\N	\N	\N	2026-07-02 15:54:58	2026-07-02 15:54:58	\N
019f2430-b0ce-71c4-87d1-a0b07a3659fe	019f2430-b0a5-7168-99e2-09976a758ec7	\N	\N	\N	\N	\N	\N	2026-07-02 15:56:38	2026-07-02 15:56:38	\N
019f2433-82ea-71e2-b590-59a18e07e530	019f2433-82e1-72dd-b6b4-8bc045fd7576	\N	\N	\N	\N	\N	\N	2026-07-02 15:59:43	2026-07-02 15:59:43	\N
019f2434-6f71-713e-b816-b6e88bec2487	019f2434-6f67-7332-8c69-ace3defb4a53	\N	\N	\N	\N	\N	\N	2026-07-02 16:00:44	2026-07-02 16:00:44	\N
019f2435-80c0-730a-bb80-034a11b5ba67	019f2435-80b5-70be-ab51-c221666b406e	\N	\N	\N	\N	\N	\N	2026-07-02 16:01:53	2026-07-02 16:01:53	\N
019f2436-ff0f-70d8-9b84-b7578ecf89e5	019f2436-fefc-7357-950c-f69baadedaef	\N	\N	\N	\N	\N	\N	2026-07-02 16:03:31	2026-07-02 16:03:31	\N
019f2438-0e6a-73a1-8526-81448af47a6a	019f2438-0e60-7065-958b-8abb179113aa	\N	\N	\N	\N	\N	\N	2026-07-02 16:04:41	2026-07-02 16:04:41	\N
019f2439-295e-71fa-b785-fda27816196f	019f2439-2956-72a4-9af9-146653403346	\N	\N	\N	\N	\N	\N	2026-07-02 16:05:53	2026-07-02 16:05:53	\N
019f243a-58c0-7201-8d19-cf2cdbac8085	019f243a-58b2-733b-b14a-c57263f12319	\N	\N	\N	\N	\N	\N	2026-07-02 16:07:11	2026-07-02 16:07:11	\N
019f243b-6e94-70dd-ba77-8f80bf544eaa	019f243b-6e89-71a8-aeb0-a23061a21981	\N	\N	\N	\N	\N	\N	2026-07-02 16:08:22	2026-07-02 16:08:22	\N
019f243c-5462-731c-8dad-ddf26336942a	019f243c-5459-7395-85e8-00bdb60348d5	\N	\N	\N	\N	\N	\N	2026-07-02 16:09:21	2026-07-02 16:09:21	\N
019f243e-7d08-73a4-a037-cd5dff8ec98c	019f243e-7cf8-729a-8105-6fc7c7eeb656	\N	\N	\N	\N	\N	\N	2026-07-02 16:11:42	2026-07-02 16:11:42	\N
019f243f-b479-702b-9b38-974a9df20ec6	019f243f-b46d-737f-b478-99d82ec8f5c0	\N	\N	\N	\N	\N	\N	2026-07-02 16:13:02	2026-07-02 16:13:02	\N
019f246e-b8c6-7112-be10-55a61d60c634	019f246e-b89c-7370-9d32-c18d1f44ed20	Isabelina Gonzalez Benitez	18997241149	Dona de casa	Cristian Arnildo Delvalle Bogado	\N	\N	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f2467-9b69-7157-8226-f6d1951b27b3	019f2467-9b5c-7175-a77e-a718ede6b1a7	Isabelina Gonzalez Benitez	18997241149	Dona de casa	Cristian Arnildo Delvalle Bogado	\N	\N	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f248e-bab1-710a-bc80-641b92f87668	019f248e-baa6-7148-9db4-d3d468da4a95	\N	\N	\N	\N	\N	\N	2026-07-02 17:39:21	2026-07-02 17:39:21	\N
019f2495-d8cf-736f-9317-86acc52222e6	019f2495-d8be-7284-a9d4-1e72bda0ca2d	\N	\N	\N	\N	\N	\N	2026-07-02 17:47:07	2026-07-02 17:47:07	\N
019f298b-dd5c-7315-9119-0baa60fa74b0	019f298b-dd42-72da-a454-ba7943289e0c	Priscilla Gomes de Araújo	18981308898	Escola Jd Real	Vinicius Santana Bezerra	18991547448	Instituto Federal	2026-07-03 16:54:19	2026-07-03 16:54:19	\N
019f3882-585e-733f-9c6d-472aad6f55fb	019f3882-5836-702a-8f3a-e31bfe5a8392	\N	\N	\N	\N	\N	\N	2026-07-06 14:38:14	2026-07-06 14:38:14	\N
019fc8b1-9e6d-73ac-99c2-0503c12a3b7d	019fc8b1-9e40-7258-bc42-6c5502e495b7	\N	\N	\N	\N	\N	\N	2026-08-03 14:35:11	2026-08-03 14:35:11	\N
019fdd22-e13b-710e-9316-476edf0785a4	019fdd22-e121-7093-8603-1c5da640d3b9	Thays Pereira da Silva	18996752831	Fape	Claudinei Secchi	\N	Terraplanagem	2026-08-07 13:51:18	2026-08-07 13:51:18	\N
01a0166a-0385-715b-b697-024a65e09bf8	01a0166a-0339-700d-9eb9-519b80b05c1b	Tabata Eugenia Melo Alves de Almeida Gomes	\N	Autonoma	Antonio Carlos de Paula Gomes	\N	Rousselout	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a034bb-d320-7291-9ea0-7bcfd6865d2d	01a034bb-d2df-70fc-ba01-d309f32df657	\N	\N	\N	\N	\N	\N	2026-08-24 14:05:19	2026-08-24 14:05:19	\N
01a0443f-835e-70a7-a048-9b00b4c45dba	01a0443f-8330-7233-ad2d-ade67d6262d5	Joyce Fagundes Santos Suares	18981415986	Ale Transportes	Fabio Luiz Suarez Rodrigues	\N	\N	2026-08-27 14:23:28	2026-08-27 14:23:28	\N
01a04445-f3cf-7139-b04e-7878fbf988f0	01a04445-f3c5-7234-baad-000c79bc9a6b	Geisa Fagundes Santos	67992958834	Do lar	Andre Diogo Mansuour Loveira	67991490815	Lar	2026-08-27 14:30:30	2026-08-27 14:30:30	\N
01a04451-0492-7397-bd1e-e57bbd18e53f	01a04451-046d-725f-a23c-fad397c4b95c	Geisa Fagundes Santos	\N	Do lar	Andre Diogo Mansouor Loveira	\N	\N	2026-08-27 14:42:35	2026-08-27 14:42:35	\N
01a0449d-892b-7074-b24e-8b3d5fda9825	01a0449d-87ed-7162-994a-1027af7499a0	\N	\N	\N	\N	\N	\N	2026-08-27 16:06:10	2026-08-27 16:06:10	\N
01a0b563-5439-731a-aad1-cbd5192b31b0	01a0b563-5427-723a-812a-0f175368a841	\N	\N	\N	\N	\N	\N	2026-09-18 13:39:40	2026-09-18 13:39:40	\N
01a0b55f-d55a-73b0-8e3d-ecd833283ea9	01a0b55f-d535-7259-9c00-4a8ef2486221	\N	\N	\N	\N	\N	\N	2026-09-18 13:35:51	2026-09-18 13:40:08	2026-09-18 13:40:08
01a0d954-e8c9-73c9-9ad4-597e77c954e1	01a0d954-e883-720d-b7ea-3e68db80d027	\N	\N	\N	Nivaldo Aparecido Mathias	\N	Autonomo	2026-09-25 13:10:15	2026-09-25 13:10:15	\N
01a0da50-203f-73d1-a437-a35630a833ed	01a0da50-2002-7370-87c4-2a6b32841190	Maria de Fatima Oliveira da Silva	\N	Dona do Lar	Tiago dos Santos Melo	\N	Curtume	2026-09-25 17:44:39	2026-09-25 17:44:39	\N
01a10dc0-d8c8-716b-ab01-0b46b77827f3	01a10dc0-d890-73a0-9107-98fd25a324ef	Marcia Maria Gomes Gomides	\N	\N	Thiago Vargas Viana	\N	\N	2026-10-05 17:28:24	2026-10-05 17:28:24	\N
01a12207-d5a8-71a4-908e-adf7f41ea002	01a12207-d572-7227-a89e-9f11da7b3920	Vanessa Angeloni Ozeias	\N	\N	Jean Ozeias da Silva	\N	\N	2026-10-09 15:58:21	2026-10-09 15:58:21	\N
01a13673-e1cd-701d-a890-44e3d1b01e16	01a13673-e182-70e4-b8d5-b9832d4783ca	ANA PAULA ALVES	18981058539	SUPER NETO	OTAVIO WINICIUS DOS SANTOS	18981031072	PRESTADOR DE SERVIÇO CONTABILIDADE - AUTONOMO	2026-10-13 15:08:46	2026-10-13 15:19:26	\N
01a155ae-6739-72e7-a552-4c7d2e8bbef2	01a155ae-66e2-718d-bbe7-f70fac829f36	Renata Dornelas Leite de Lima	\N	\N	Erickson Santana Lima	\N	\N	2026-10-19 16:40:55	2026-10-19 16:40:55	\N
\.


--
-- Data for Name: participant_guardians; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participant_guardians (id, participant_id, name, relationship, phone, workplace, address, created_at, updated_at, deleted_at) FROM stdin;
019eaabc-2ffe-72a7-8e98-7dcf66ab297d	019ea894-9707-71dd-9448-f213e631ac55	\N	\N	\N	\N	\N	2026-06-09 01:55:20	2026-06-09 01:55:20	\N
019ead93-1a56-7072-a467-8de167411e23	019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	\N	\N	\N	\N	\N	2026-06-09 15:09:19	2026-06-09 15:09:19	\N
019eaf18-2c3a-726b-a36b-7c6572dbaedd	019ea83c-cd1e-7115-a782-580ff6e2df46	\N	\N	\N	\N	\N	2026-06-09 22:14:17	2026-06-09 22:14:17	\N
019efff0-a149-727f-ac2e-3e5a6cb83c94	019efff0-a100-7079-958e-eff405049f6e	\N	\N	\N	\N	\N	2026-06-25 15:00:20	2026-06-25 15:00:20	\N
019f23cf-d281-7138-8d7b-62e312af581e	019f23cf-d26e-72e4-a177-4aa236ea8020	\N	\N	\N	\N	\N	2026-07-02 14:10:50	2026-07-02 14:10:50	\N
019f23d2-0f77-73bc-be2a-58cc133c15a2	019f23d2-0f65-72c1-b310-f08055930c63	\N	\N	\N	\N	\N	2026-07-02 14:13:16	2026-07-02 14:13:16	\N
019f23d4-b34f-7179-b8d2-b9db701adb1b	019f23d4-b33e-7017-9c6c-1e52905168dc	\N	\N	\N	\N	\N	2026-07-02 14:16:09	2026-07-02 14:16:09	\N
019f23d6-29ba-734c-85ad-1d4d079c2779	019f23d6-29ab-73f7-ae5f-6bb340ad0b01	\N	\N	\N	\N	\N	2026-07-02 14:17:45	2026-07-02 14:17:45	\N
019f23d8-78eb-7007-a68d-c1da23ba83ae	019f23d8-78d0-72c9-bbce-9977a6845797	\N	\N	\N	\N	\N	2026-07-02 14:20:17	2026-07-02 14:20:17	\N
019f23da-5b79-707f-ae20-18d1142b3542	019f23da-5b6b-7138-a534-7bd65a738ab9	\N	\N	\N	\N	\N	2026-07-02 14:22:20	2026-07-02 14:22:20	\N
019f23dc-145a-7240-803b-0e913673a5e3	019f23dc-1445-72de-8c78-c1b27fa4987f	\N	\N	\N	\N	\N	2026-07-02 14:24:13	2026-07-02 14:24:13	\N
019f23dd-dcdd-71da-acd4-764b0b7a5bcf	019f23dd-dccd-7011-82e6-090a2eb2f684	\N	\N	\N	\N	\N	2026-07-02 14:26:10	2026-07-02 14:26:10	\N
019f23df-7a23-7256-85fd-5e505840a549	019f23df-7a16-71c4-972a-55fa6cd94199	\N	\N	\N	\N	\N	2026-07-02 14:27:56	2026-07-02 14:27:56	\N
019f23e1-9a88-7168-adb3-b9625dee4aaa	019f23e1-9a76-73e7-975b-b6f978a9ef40	\N	\N	\N	\N	\N	2026-07-02 14:30:15	2026-07-02 14:30:15	\N
019f23e3-21c7-732e-82b9-da65ed384be8	019f23e3-21b9-702d-9b9b-2ad7c4316d7d	\N	\N	\N	\N	\N	2026-07-02 14:31:55	2026-07-02 14:31:55	\N
019f23e5-dba6-7137-ba10-0db326d3b853	019f23e5-db97-72a5-8029-abfa9f328ed5	\N	\N	\N	\N	\N	2026-07-02 14:34:54	2026-07-02 14:34:54	\N
019f23ed-100a-72d6-9edd-04b8c71c17a5	019f23ed-0ff6-71cf-a6ca-fe8b37735aa2	\N	\N	\N	\N	\N	2026-07-02 14:42:46	2026-07-02 14:42:46	\N
019f23ef-1302-7168-adbb-90bf28986e2a	019f23ef-12f2-73d4-8239-258c964bd778	\N	\N	\N	\N	\N	2026-07-02 14:44:58	2026-07-02 14:44:58	\N
019f23ef-9af9-72c7-bdc0-df98c43de51e	019f23ef-9aec-703d-b404-c6f70cc7fd60	\N	\N	\N	\N	\N	2026-07-02 14:45:33	2026-07-02 14:45:55	2026-07-02 14:45:55
019f23f2-a3e1-7096-b31f-f1b8e203dfa8	019f23f2-a3ce-7373-a015-7f7b20e51e2a	\N	\N	\N	\N	\N	2026-07-02 14:48:52	2026-07-02 14:48:52	\N
019f23f4-b7e9-70ee-9256-8cc89b4c5dba	019f23f4-b7da-7012-890b-794942d0af42	\N	\N	\N	\N	\N	2026-07-02 14:51:08	2026-07-02 14:51:08	\N
019f23f6-282a-705d-bb3a-f8ca690656a6	019f23f6-281b-73cd-b1d0-420531076382	\N	\N	\N	\N	\N	2026-07-02 14:52:42	2026-07-02 14:52:42	\N
019f23fc-6a0b-723b-abe7-4412c578b6b7	019f23fc-69f6-72f2-a0de-0cd9261fd295	\N	\N	\N	\N	\N	2026-07-02 14:59:32	2026-07-02 14:59:32	\N
019f23fe-aadd-7037-b2d9-3ecb61fc0a89	019f23fe-aac7-7165-88a1-789edb82ede3	\N	\N	\N	\N	\N	2026-07-02 15:02:00	2026-07-02 15:02:00	\N
019f2404-7947-7082-9e10-ffdec41cb664	019f2404-7939-7034-931f-46ad4c880cd9	\N	\N	\N	\N	\N	2026-07-02 15:08:20	2026-07-02 15:08:20	\N
019f2406-03e0-728e-935d-08a61b420b1b	019f2406-03ca-731e-b4e7-d959d8162ccb	\N	\N	\N	\N	\N	2026-07-02 15:10:01	2026-07-02 15:10:01	\N
019f2408-7944-706d-b1b8-d9a831e193b2	019f2408-7937-7124-9e26-c742ab05af5f	\N	\N	\N	\N	\N	2026-07-02 15:12:42	2026-07-02 15:12:42	\N
019f240a-74c3-71d2-a9a1-cc2bd580140b	019f240a-74af-73dd-857a-149822fe001b	\N	\N	\N	\N	\N	2026-07-02 15:14:52	2026-07-02 15:14:52	\N
019f240d-c821-73a5-ade5-21f5479e638c	019f240d-c80e-72b7-b56f-ef5b303a29aa	\N	\N	\N	\N	\N	2026-07-02 15:18:30	2026-07-02 15:18:30	\N
019f240e-f99e-7190-ba4c-958b3541d9d6	019f240e-f987-7154-9fd2-ee9f250e384b	\N	\N	\N	\N	\N	2026-07-02 15:19:49	2026-07-02 15:19:49	\N
019f241c-e542-70ea-a921-f14a38c57db6	019f241c-e4e8-713d-9331-4cb794c1a10c	\N	\N	\N	\N	\N	2026-07-02 15:35:01	2026-07-02 15:35:01	\N
019f241f-9dec-7325-856d-db3659730014	019f241f-9dcf-703f-a8cc-82faa1c4a5a7	\N	\N	\N	\N	\N	2026-07-02 15:37:59	2026-07-02 15:37:59	\N
019f2421-7c68-7364-adc9-4ea040771463	019f2421-7c56-7289-8831-099c868282db	\N	\N	\N	\N	\N	2026-07-02 15:40:02	2026-07-02 15:40:02	\N
019f2423-affb-71ed-8026-ec93c568e118	019f2423-afe8-7058-a7dd-f11789ebd598	\N	\N	\N	\N	\N	2026-07-02 15:42:26	2026-07-02 15:42:26	\N
019f2425-4a7f-73a8-bb88-60f663c5fa95	019f2425-4a62-71b3-9f4d-fd22768cfc12	\N	\N	\N	\N	\N	2026-07-02 15:44:11	2026-07-02 15:44:11	\N
019f2426-977a-7179-ba2a-733efe0e83ea	019f2426-976a-73bc-8feb-fb033192f832	\N	\N	\N	\N	\N	2026-07-02 15:45:36	2026-07-02 15:45:36	\N
019f2427-873d-7078-8621-dbc4f8c0fe8f	019f2427-8730-713b-aa9b-320ce0d3342e	\N	\N	\N	\N	\N	2026-07-02 15:46:38	2026-07-02 15:46:38	\N
019f2428-cf7a-716d-91d1-8f5c1cb40698	019f2428-cf58-72cb-9d4d-5d4b255c329f	\N	\N	\N	\N	\N	2026-07-02 15:48:02	2026-07-02 15:48:02	\N
019f2429-89c0-737b-b519-4bbbdc41a145	019f2429-89ad-716b-b1ec-3fbdb7f96ba2	\N	\N	\N	\N	\N	2026-07-02 15:48:49	2026-07-02 15:48:49	\N
019f242a-f87f-70ae-a777-4f493597a5e1	019f242a-f86f-70ff-9c6e-c80dc9a3ef76	\N	\N	\N	\N	\N	2026-07-02 15:50:23	2026-07-02 15:50:23	\N
019f242d-9661-7312-916a-1112c1d6e2db	019f242d-9652-70eb-b7f5-9d6ed25bdce3	\N	\N	\N	\N	\N	2026-07-02 15:53:15	2026-07-02 15:53:15	\N
019f242f-2839-72b8-b782-d55abb2e9a58	019f242f-282a-7079-a7d7-a80727513a91	\N	\N	\N	\N	\N	2026-07-02 15:54:58	2026-07-02 15:54:58	\N
019f2430-b0d4-734f-b235-81dbbba52a5f	019f2430-b0a5-7168-99e2-09976a758ec7	\N	\N	\N	\N	\N	2026-07-02 15:56:38	2026-07-02 15:56:38	\N
019f2433-82ee-723d-a911-44c922a05339	019f2433-82e1-72dd-b6b4-8bc045fd7576	\N	\N	\N	\N	\N	2026-07-02 15:59:43	2026-07-02 15:59:43	\N
019f2434-6f76-73dc-ba22-2797f28eac3c	019f2434-6f67-7332-8c69-ace3defb4a53	\N	\N	\N	\N	\N	2026-07-02 16:00:44	2026-07-02 16:00:44	\N
019f2435-80c9-703a-9d65-1a1958046a84	019f2435-80b5-70be-ab51-c221666b406e	\N	\N	\N	\N	\N	2026-07-02 16:01:53	2026-07-02 16:01:53	\N
019f2436-ff1e-7301-8991-4ad93af1c397	019f2436-fefc-7357-950c-f69baadedaef	\N	\N	\N	\N	\N	2026-07-02 16:03:31	2026-07-02 16:03:31	\N
019f2438-0e6f-73aa-9467-a5121da509fa	019f2438-0e60-7065-958b-8abb179113aa	\N	\N	\N	\N	\N	2026-07-02 16:04:41	2026-07-02 16:04:41	\N
019f2439-2962-724b-b1bc-7aa9bb85ee1e	019f2439-2956-72a4-9af9-146653403346	\N	\N	\N	\N	\N	2026-07-02 16:05:53	2026-07-02 16:05:53	\N
019f243a-58c5-72f4-8588-c1e7446fc4af	019f243a-58b2-733b-b14a-c57263f12319	\N	\N	\N	\N	\N	2026-07-02 16:07:11	2026-07-02 16:07:11	\N
019f243b-6e98-71ce-b1b5-38c1ed653bc2	019f243b-6e89-71a8-aeb0-a23061a21981	\N	\N	\N	\N	\N	2026-07-02 16:08:22	2026-07-02 16:08:22	\N
019f243c-5465-70d4-aa14-32269c83ec38	019f243c-5459-7395-85e8-00bdb60348d5	\N	\N	\N	\N	\N	2026-07-02 16:09:21	2026-07-02 16:09:21	\N
019f243e-7d0d-72fb-885e-d1f3a3e95d2e	019f243e-7cf8-729a-8105-6fc7c7eeb656	\N	\N	\N	\N	\N	2026-07-02 16:11:42	2026-07-02 16:11:42	\N
019f243f-b47d-7126-85ff-1dc51a49e9ab	019f243f-b46d-737f-b478-99d82ec8f5c0	\N	\N	\N	\N	\N	2026-07-02 16:13:02	2026-07-02 16:13:02	\N
019f246e-b8ce-7295-8413-8496a977f607	019f246e-b89c-7370-9d32-c18d1f44ed20	\N	\N	\N	\N	\N	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f2467-9b6f-7048-8c74-5a0cd59a5323	019f2467-9b5c-7175-a77e-a718ede6b1a7	\N	\N	\N	\N	\N	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f248e-bab5-7185-bd5e-f72551ed29f3	019f248e-baa6-7148-9db4-d3d468da4a95	\N	\N	\N	\N	\N	2026-07-02 17:39:21	2026-07-02 17:39:21	\N
019f2495-d8d3-7275-b193-88fe00f2702c	019f2495-d8be-7284-a9d4-1e72bda0ca2d	\N	\N	\N	\N	\N	2026-07-02 17:47:07	2026-07-02 17:47:07	\N
019f298b-dd61-70a8-a5ce-16a97a86a58b	019f298b-dd42-72da-a454-ba7943289e0c	\N	\N	\N	\N	\N	2026-07-03 16:54:19	2026-07-03 16:54:19	\N
019f3882-5863-72a6-8124-0da4e871f984	019f3882-5836-702a-8f3a-e31bfe5a8392	\N	\N	\N	\N	\N	2026-07-06 14:38:14	2026-07-06 14:38:14	\N
019fc8b1-9e74-726a-9f1b-628ad9260ea2	019fc8b1-9e40-7258-bc42-6c5502e495b7	\N	\N	\N	\N	\N	2026-08-03 14:35:11	2026-08-03 14:35:11	\N
019fdd22-e141-733f-a046-93dac4d0f893	019fdd22-e121-7093-8603-1c5da640d3b9	\N	\N	\N	\N	\N	2026-08-07 13:51:18	2026-08-07 13:51:18	\N
01a0166a-0399-71da-be0f-ca3bafebb3b3	01a0166a-0339-700d-9eb9-519b80b05c1b	\N	\N	\N	\N	\N	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a034bb-d327-71d9-9a58-187fd0101fce	01a034bb-d2df-70fc-ba01-d309f32df657	\N	\N	\N	\N	\N	2026-08-24 14:05:19	2026-08-24 14:05:19	\N
01a0443f-8365-7085-ae1c-0915f028176a	01a0443f-8330-7233-ad2d-ade67d6262d5	Geisa Fagundes Santos	Tia	67992958834	Do lar	Rua Joao pessoa 25-86	2026-08-27 14:23:28	2026-08-27 14:23:28	\N
01a04445-f3d3-73d6-9071-afdb8f27e6dc	01a04445-f3c5-7234-baad-000c79bc9a6b	Joyce Fagundes Santos	Tia	\N	\N	\N	2026-08-27 14:30:30	2026-08-27 14:30:30	\N
01a04451-049f-7013-90d4-86bf2e7b1642	01a04451-046d-725f-a23c-fad397c4b95c	\N	\N	\N	\N	\N	2026-08-27 14:42:35	2026-08-27 14:42:35	\N
01a0449d-894b-72ac-8c96-b73395852503	01a0449d-87ed-7162-994a-1027af7499a0	\N	\N	\N	\N	\N	2026-08-27 16:06:10	2026-08-27 16:06:10	\N
01a0b563-543f-72d5-9f30-ecf2b41d3724	01a0b563-5427-723a-812a-0f175368a841	\N	\N	\N	\N	\N	2026-09-18 13:39:40	2026-09-18 13:39:40	\N
01a0b55f-d562-732b-ad52-bb5104454ab9	01a0b55f-d535-7259-9c00-4a8ef2486221	\N	\N	\N	\N	\N	2026-09-18 13:35:51	2026-09-18 13:40:08	2026-09-18 13:40:08
01a0d954-e8d0-7332-9f02-fb6adf5081d1	01a0d954-e883-720d-b7ea-3e68db80d027	Nivaldo Aparecido Mathias	\N	\N	\N	\N	2026-09-25 13:10:15	2026-09-25 13:10:15	\N
01a0da50-2045-7116-8f6a-187eba2b37ad	01a0da50-2002-7370-87c4-2a6b32841190	\N	\N	\N	\N	\N	2026-09-25 17:44:39	2026-09-25 17:44:39	\N
01a10dc0-d8cf-7323-a366-2cf82053a973	01a10dc0-d890-73a0-9107-98fd25a324ef	\N	\N	\N	\N	\N	2026-10-05 17:28:24	2026-10-05 17:28:24	\N
01a12207-d5ae-70d0-b488-c620c146d727	01a12207-d572-7227-a89e-9f11da7b3920	\N	\N	\N	\N	\N	2026-10-09 15:58:21	2026-10-09 15:58:21	\N
01a13673-e1d5-73ef-a5e4-d1dd3bd6c7bc	01a13673-e182-70e4-b8d5-b9832d4783ca	\N	\N	\N	\N	\N	2026-10-13 15:08:46	2026-10-13 15:08:46	\N
01a155ae-673f-71d6-9dd8-d3f87072b5e0	01a155ae-66e2-718d-bbe7-f70fac829f36	\N	\N	\N	\N	\N	2026-10-19 16:40:55	2026-10-19 16:40:55	\N
\.


--
-- Data for Name: participant_health; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participant_health (id, participant_id, has_health_issue, health_issue_description, has_disability, disability_description, has_medicine_allergy, medicine_allergy_description, has_food_intolerance, food_intolerance_description, has_regular_medicine, regular_medicine_description, created_at, updated_at, deleted_at) FROM stdin;
019ea83d-1560-73ae-9cdf-9daa7d3910bb	019ea83c-cd1e-7115-a782-580ff6e2df46	f	\N	f	\N	f	\N	f	\N	f	\N	2026-06-08 14:17:16	2026-06-08 14:17:16	\N
019eaabc-3018-7235-99ba-afd4f9c23d55	019ea894-9707-71dd-9448-f213e631ac55	f	\N	f	\N	f	\N	f	\N	f	\N	2026-06-09 01:55:20	2026-06-09 01:55:33	\N
019ead93-1a6f-704f-9468-de616c1fb222	019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	f	\N	f	\N	f	\N	f	\N	f	\N	2026-06-09 15:09:19	2026-06-09 15:09:19	\N
019efff0-a164-721a-a126-2e33e3e8f99e	019efff0-a100-7079-958e-eff405049f6e	f	\N	f	\N	f	\N	f	\N	f	\N	2026-06-25 15:00:20	2026-06-25 15:00:20	\N
019f23cf-d295-71e4-913c-2522ddc279b1	019f23cf-d26e-72e4-a177-4aa236ea8020	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:10:50	2026-07-02 14:10:50	\N
019f23d2-0f8c-72d9-ae3f-b4f2b68feee7	019f23d2-0f65-72c1-b310-f08055930c63	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:13:16	2026-07-02 14:13:16	\N
019f23d4-b365-727a-a445-2858a78b8cee	019f23d4-b33e-7017-9c6c-1e52905168dc	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:16:09	2026-07-02 14:16:09	\N
019f23d6-29ca-7314-a0d0-1401cfcf4718	019f23d6-29ab-73f7-ae5f-6bb340ad0b01	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:17:45	2026-07-02 14:17:45	\N
019f23d8-790d-71ce-b77e-f06fd252355e	019f23d8-78d0-72c9-bbce-9977a6845797	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:20:17	2026-07-02 14:20:17	\N
019f23da-5b88-73a5-9120-6c490e33bf1d	019f23da-5b6b-7138-a534-7bd65a738ab9	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:22:20	2026-07-02 14:22:20	\N
019f23dc-146d-7326-95ba-8d0274b2799e	019f23dc-1445-72de-8c78-c1b27fa4987f	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:24:13	2026-07-02 14:24:13	\N
019f23dd-dcf1-7065-96d5-2f46c94d7a81	019f23dd-dccd-7011-82e6-090a2eb2f684	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:26:10	2026-07-02 14:26:10	\N
019f23df-7a37-7391-b669-59aaa5e02dd3	019f23df-7a16-71c4-972a-55fa6cd94199	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:27:56	2026-07-02 14:27:56	\N
019f23e1-9a9d-7315-8cf9-4a03394a42a3	019f23e1-9a76-73e7-975b-b6f978a9ef40	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:30:15	2026-07-02 14:30:15	\N
019f23e3-21d7-72f7-810e-d94a5826b27f	019f23e3-21b9-702d-9b9b-2ad7c4316d7d	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:31:55	2026-07-02 14:31:55	\N
019f23e5-dbba-73ff-a94e-3c5ae42c8a16	019f23e5-db97-72a5-8029-abfa9f328ed5	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:34:54	2026-07-02 14:34:54	\N
019f23ed-1019-7290-b762-5745df17382a	019f23ed-0ff6-71cf-a6ca-fe8b37735aa2	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:42:46	2026-07-02 14:42:46	\N
019f23ef-1317-72e9-a374-e91b6aff754e	019f23ef-12f2-73d4-8239-258c964bd778	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:44:58	2026-07-02 14:44:58	\N
019f23ef-9b0a-704e-806b-a782d6f744f3	019f23ef-9aec-703d-b404-c6f70cc7fd60	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:45:33	2026-07-02 14:45:55	2026-07-02 14:45:55
019f23f2-a3f4-738d-a14c-22ebb4e7d195	019f23f2-a3ce-7373-a015-7f7b20e51e2a	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:48:52	2026-07-02 14:48:52	\N
019f23f4-b7fb-70ff-91fe-571a590544c2	019f23f4-b7da-7012-890b-794942d0af42	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:51:08	2026-07-02 14:51:08	\N
019f23f6-283e-7368-a6c1-d949fd597a27	019f23f6-281b-73cd-b1d0-420531076382	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:52:42	2026-07-02 14:52:42	\N
019f23fc-6a1e-711d-847a-1c25c5230303	019f23fc-69f6-72f2-a0de-0cd9261fd295	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 14:59:32	2026-07-02 14:59:32	\N
019f23fe-aaf5-725d-8c52-b8662a122b24	019f23fe-aac7-7165-88a1-789edb82ede3	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:02:00	2026-07-02 15:02:00	\N
019f2404-795d-713f-82d7-f8bf68ca3fc3	019f2404-7939-7034-931f-46ad4c880cd9	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:08:20	2026-07-02 15:08:20	\N
019f2406-0438-7358-9cd3-0bbb58f46d82	019f2406-03ca-731e-b4e7-d959d8162ccb	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:10:01	2026-07-02 15:10:01	\N
019f2408-7956-735a-b8b8-4593745f3071	019f2408-7937-7124-9e26-c742ab05af5f	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:12:42	2026-07-02 15:12:42	\N
019f240a-74d7-73c9-9c6e-bee3f254de32	019f240a-74af-73dd-857a-149822fe001b	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:14:52	2026-07-02 15:14:52	\N
019f240d-c836-716e-bf2f-0929d23f2213	019f240d-c80e-72b7-b56f-ef5b303a29aa	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:18:30	2026-07-02 15:18:30	\N
019f240e-f9b7-704a-9eee-163c95408bc3	019f240e-f987-7154-9fd2-ee9f250e384b	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:19:49	2026-07-02 15:19:49	\N
019f241c-e5dc-73b6-a61a-81626e8011ea	019f241c-e4e8-713d-9331-4cb794c1a10c	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:35:01	2026-07-02 15:35:01	\N
019f241f-9e0c-709d-b52f-8c5f1e676f7c	019f241f-9dcf-703f-a8cc-82faa1c4a5a7	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:37:59	2026-07-02 15:37:59	\N
019f2421-7c81-7144-9389-4b5372d08340	019f2421-7c56-7289-8831-099c868282db	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:40:02	2026-07-02 15:40:02	\N
019f2423-b018-71a1-b03f-f85026f2b090	019f2423-afe8-7058-a7dd-f11789ebd598	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:42:26	2026-07-02 15:42:26	\N
019f2425-4a9f-71c8-84a3-b4e3cd658456	019f2425-4a62-71b3-9f4d-fd22768cfc12	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:44:11	2026-07-02 15:44:11	\N
019f2426-978e-7332-b8c5-9b6eb0545788	019f2426-976a-73bc-8feb-fb033192f832	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:45:36	2026-07-02 15:45:36	\N
019f2427-874f-7124-b373-7e17d5e91a30	019f2427-8730-713b-aa9b-320ce0d3342e	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:46:38	2026-07-02 15:46:38	\N
019f2428-cfde-72f4-81dc-ef8ef9c55a2a	019f2428-cf58-72cb-9d4d-5d4b255c329f	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:48:02	2026-07-02 15:48:02	\N
019f2429-89d5-7334-8d76-8486cb75ab8c	019f2429-89ad-716b-b1ec-3fbdb7f96ba2	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:48:49	2026-07-02 15:48:49	\N
019f242a-f88f-7038-9156-95b31f77a103	019f242a-f86f-70ff-9c6e-c80dc9a3ef76	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:50:23	2026-07-02 15:50:23	\N
019f242d-9672-727b-93a9-19358d1cc7b0	019f242d-9652-70eb-b7f5-9d6ed25bdce3	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:53:15	2026-07-02 15:53:15	\N
019f242f-284c-7376-a8fb-5533e51361fd	019f242f-282a-7079-a7d7-a80727513a91	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:54:58	2026-07-02 15:54:58	\N
019f2430-b0e6-700d-852b-a049bb9ed213	019f2430-b0a5-7168-99e2-09976a758ec7	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:56:38	2026-07-02 15:56:38	\N
019f2433-82ff-70e4-b1a2-9fa5bb16c8e9	019f2433-82e1-72dd-b6b4-8bc045fd7576	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 15:59:43	2026-07-02 15:59:43	\N
019f2434-6f89-71af-8eab-58023cb7bf85	019f2434-6f67-7332-8c69-ace3defb4a53	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:00:44	2026-07-02 16:00:44	\N
019f2435-80e8-7128-a944-5b658f735863	019f2435-80b5-70be-ab51-c221666b406e	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:01:54	2026-07-02 16:01:54	\N
019f2436-ff3a-7351-b6b7-182ef5a2f4a7	019f2436-fefc-7357-950c-f69baadedaef	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:03:31	2026-07-02 16:03:31	\N
019f2438-0e80-7269-8a45-ad3275e7e200	019f2438-0e60-7065-958b-8abb179113aa	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:04:41	2026-07-02 16:04:41	\N
019f2439-2970-709c-83df-17d637aaf43f	019f2439-2956-72a4-9af9-146653403346	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:05:53	2026-07-02 16:05:53	\N
019f243a-58d9-7023-8ca8-2c7af0318cde	019f243a-58b2-733b-b14a-c57263f12319	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:07:11	2026-07-02 16:07:11	\N
019f243b-6eaa-7166-b77f-c67eb056f145	019f243b-6e89-71a8-aeb0-a23061a21981	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:08:22	2026-07-02 16:08:22	\N
019f243c-5475-725d-938b-214aa53d484f	019f243c-5459-7395-85e8-00bdb60348d5	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:09:21	2026-07-02 16:09:21	\N
019f243e-7d20-7332-a30c-c16e441c6fbf	019f243e-7cf8-729a-8105-6fc7c7eeb656	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:11:42	2026-07-02 16:11:42	\N
019f243f-b491-73a4-8597-6c3e0062349d	019f243f-b46d-737f-b478-99d82ec8f5c0	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:13:02	2026-07-02 16:13:02	\N
019f246e-b8f2-713e-aee0-3032dd2c35ed	019f246e-b89c-7370-9d32-c18d1f44ed20	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f2467-9bc1-73da-9fff-dc6abd5cda88	019f2467-9b5c-7175-a77e-a718ede6b1a7	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f248e-bac6-7374-b913-8c2064280c1c	019f248e-baa6-7148-9db4-d3d468da4a95	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 17:39:21	2026-07-02 17:39:21	\N
019f2495-d8e3-72fb-8ea7-9c293c6e5dab	019f2495-d8be-7284-a9d4-1e72bda0ca2d	f	\N	f	\N	f	\N	f	\N	f	\N	2026-07-02 17:47:08	2026-07-02 17:47:08	\N
019f298b-dd9c-7285-9004-2303d0fc96ed	019f298b-dd42-72da-a454-ba7943289e0c	f	\N	f	\N	f	\N	t	Camarão e frutos do mar	f	\N	2026-07-03 16:54:19	2026-07-03 16:57:28	\N
019f3882-587a-70dd-8f81-01f30545df0d	019f3882-5836-702a-8f3a-e31bfe5a8392	t	Diabetes, hipertensão, Arritmia cardiarca	f	\N	f	\N	f	\N	t	Hidrion, Insulina e captopril	2026-07-06 14:38:14	2026-07-06 14:38:14	\N
019fc8b1-9e89-72cb-b401-a3b4ef50038b	019fc8b1-9e40-7258-bc42-6c5502e495b7	t	Hipertensão, Diabetes	f	\N	f	\N	f	\N	t	Losartana, Koris, Glifagge	2026-08-03 14:35:11	2026-08-03 14:35:11	\N
019fdd22-e173-703b-a257-1a5eddafe455	019fdd22-e121-7093-8603-1c5da640d3b9	f	\N	f	\N	f	\N	f	\N	f	\N	2026-08-07 13:51:18	2026-08-07 13:51:18	\N
01a0166a-03eb-72d1-91ba-2bf6ce3954fa	01a0166a-0339-700d-9eb9-519b80b05c1b	t	Dermatite Emocional	f	\N	f	\N	f	\N	f	\N	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a034bb-d348-716b-87bd-c0488de130f8	01a034bb-d2df-70fc-ba01-d309f32df657	t	Cardiaca	f	\N	t	Tramal	t	\N	t	Hidroclorotiazida 25mg, Clopidogel 75mg, Ezetimiba 10mg, Metropolol 50mg, Losartana potássica 50mg	2026-08-24 14:05:19	2026-08-24 14:05:19	\N
01a0443f-837e-7133-95e7-474e04766aac	01a0443f-8330-7233-ad2d-ade67d6262d5	f	\N	f	\N	f	\N	f	\N	f	\N	2026-08-27 14:23:28	2026-08-27 14:23:28	\N
01a04445-f3e4-7103-9659-05a46d15fb71	01a04445-f3c5-7234-baad-000c79bc9a6b	f	\N	f	\N	f	\N	f	\N	f	\N	2026-08-27 14:30:30	2026-08-27 14:30:30	\N
01a04451-04bc-7318-a1e3-e6d4c3ab1d97	01a04451-046d-725f-a23c-fad397c4b95c	f	\N	f	\N	f	\N	f	\N	f	\N	2026-08-27 14:42:35	2026-08-27 14:42:35	\N
01a0449d-8a0a-7172-a734-349347d3fca0	01a0449d-87ed-7162-994a-1027af7499a0	t	Hipertensão	f	\N	f	\N	f	\N	t	\N	2026-08-27 16:06:10	2026-08-27 16:06:10	\N
01a0b563-546c-72ff-8d84-fa83f79fc151	01a0b563-5427-723a-812a-0f175368a841	f	\N	f	\N	f	\N	f	\N	f	\N	2026-09-18 13:39:40	2026-09-18 13:39:40	\N
01a0b55f-d57f-7394-bbd1-c137cf262b63	01a0b55f-d535-7259-9c00-4a8ef2486221	f	\N	f	\N	f	\N	f	\N	f	\N	2026-09-18 13:35:51	2026-09-18 13:40:08	2026-09-18 13:40:08
01a0d954-e91a-724e-8600-fb22b2e3fd1a	01a0d954-e883-720d-b7ea-3e68db80d027	f	\N	f	\N	f	\N	f	\N	f	\N	2026-09-25 13:10:15	2026-09-25 13:10:15	\N
01a0da50-2075-72c5-90f7-500a1924cdda	01a0da50-2002-7370-87c4-2a6b32841190	f	\N	f	\N	f	\N	f	\N	f	\N	2026-09-25 17:44:39	2026-09-25 17:44:39	\N
01a10dc0-d902-712c-8b8d-05771eae00f9	01a10dc0-d890-73a0-9107-98fd25a324ef	t	Dermatite, Renite, Cinuzite	f	\N	f	\N	f	\N	f	\N	2026-10-05 17:28:24	2026-10-05 17:28:24	\N
01a12207-d5df-7132-b626-778f7f42302a	01a12207-d572-7227-a89e-9f11da7b3920	f	\N	f	\N	f	\N	f	\N	f	\N	2026-10-09 15:58:21	2026-10-09 15:58:21	\N
01a13673-e1f4-71d2-aad0-cda1753a7a1e	01a13673-e182-70e4-b8d5-b9832d4783ca	f	\N	f	\N	f	\N	t	KATCHUP	f	\N	2026-10-13 15:08:46	2026-10-13 15:19:26	\N
01a155ae-678f-700d-a0ef-b8cd38f84e33	01a155ae-66e2-718d-bbe7-f70fac829f36	f	\N	f	\N	f	\N	f	\N	f	\N	2026-10-19 16:40:55	2026-10-19 16:40:55	\N
\.


--
-- Data for Name: participant_housings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participant_housings (id, participant_id, property_type, property_type_other, rent_value, has_running_water, has_sewage, has_electricity, nis, has_benefits, benefits_description, created_at, updated_at, deleted_at) FROM stdin;
019eaabc-3010-723f-9c47-8e7afb095002	019ea894-9707-71dd-9448-f213e631ac55	\N	\N	\N	f	f	f	\N	f	\N	2026-06-09 01:55:20	2026-06-09 01:55:20	\N
019ead93-1a69-724c-8d07-5263356342bd	019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	\N	\N	\N	f	f	f	\N	f	\N	2026-06-09 15:09:19	2026-06-09 15:09:19	\N
019eaf18-2c51-712c-8c32-419b12b94ff0	019ea83c-cd1e-7115-a782-580ff6e2df46	\N	\N	\N	f	f	f	\N	f	\N	2026-06-09 22:14:17	2026-06-09 22:14:17	\N
019efff0-a15e-738d-84ac-8d7f6b01afd6	019efff0-a100-7079-958e-eff405049f6e	\N	\N	\N	f	f	f	\N	f	\N	2026-06-25 15:00:20	2026-06-25 15:00:20	\N
019f23cf-d28f-7064-b045-1d5361b73701	019f23cf-d26e-72e4-a177-4aa236ea8020	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:10:50	2026-07-02 14:10:50	\N
019f23d2-0f86-734c-bd7b-6a10443278a5	019f23d2-0f65-72c1-b310-f08055930c63	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:13:16	2026-07-02 14:13:16	\N
019f23d4-b35e-735e-9b3d-40fb374fe6e9	019f23d4-b33e-7017-9c6c-1e52905168dc	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:16:09	2026-07-02 14:16:09	\N
019f23d6-29c6-7042-8025-3556fc6a16f2	019f23d6-29ab-73f7-ae5f-6bb340ad0b01	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:17:45	2026-07-02 14:17:45	\N
019f23d8-7903-72d4-b434-bb46cb39edf0	019f23d8-78d0-72c9-bbce-9977a6845797	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:20:17	2026-07-02 14:20:17	\N
019f23da-5b84-72db-b137-8cd2faf1db9a	019f23da-5b6b-7138-a534-7bd65a738ab9	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:22:20	2026-07-02 14:22:20	\N
019f23dc-1469-7303-b1ba-c5ba8a24ae08	019f23dc-1445-72de-8c78-c1b27fa4987f	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:24:13	2026-07-02 14:24:13	\N
019f23dd-dceb-711d-a7cc-a14c0bb894d8	019f23dd-dccd-7011-82e6-090a2eb2f684	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:26:10	2026-07-02 14:26:10	\N
019f23df-7a31-71e7-967c-22a8c1f9dc00	019f23df-7a16-71c4-972a-55fa6cd94199	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:27:56	2026-07-02 14:27:56	\N
019f23e1-9a96-735d-abac-9ff436f83f29	019f23e1-9a76-73e7-975b-b6f978a9ef40	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:30:15	2026-07-02 14:30:15	\N
019f23e3-21d3-700b-bdde-eaaa444da7ea	019f23e3-21b9-702d-9b9b-2ad7c4316d7d	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:31:55	2026-07-02 14:31:55	\N
019f23e5-dbb3-713a-88c7-a3bef4c53f28	019f23e5-db97-72a5-8029-abfa9f328ed5	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:34:54	2026-07-02 14:34:54	\N
019f23ed-1015-71da-81c7-8f27e374b036	019f23ed-0ff6-71cf-a6ca-fe8b37735aa2	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:42:46	2026-07-02 14:42:46	\N
019f23ef-1311-73e2-b8f0-c68e19a1aa16	019f23ef-12f2-73d4-8239-258c964bd778	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:44:58	2026-07-02 14:44:58	\N
019f23ef-9b05-7083-88e0-b900a370bbd7	019f23ef-9aec-703d-b404-c6f70cc7fd60	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:45:33	2026-07-02 14:45:55	2026-07-02 14:45:55
019f23f2-a3ef-72cd-b3db-3f84c216d1cd	019f23f2-a3ce-7373-a015-7f7b20e51e2a	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:48:52	2026-07-02 14:48:52	\N
019f23f4-b7f6-701d-ad1e-ba4f06642eee	019f23f4-b7da-7012-890b-794942d0af42	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:51:08	2026-07-02 14:51:08	\N
019f23f6-2838-728d-a8cb-4edc05320520	019f23f6-281b-73cd-b1d0-420531076382	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:52:42	2026-07-02 14:52:42	\N
019f23fc-6a19-73dc-955c-63f3f85b4008	019f23fc-69f6-72f2-a0de-0cd9261fd295	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 14:59:32	2026-07-02 14:59:32	\N
019f23fe-aaed-71ae-ab24-7b185ac5de13	019f23fe-aac7-7165-88a1-789edb82ede3	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:02:00	2026-07-02 15:02:00	\N
019f2404-7957-73a0-92e6-118aa53a0b1b	019f2404-7939-7034-931f-46ad4c880cd9	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:08:20	2026-07-02 15:08:20	\N
019f2406-03f3-711b-9e10-2422352366d0	019f2406-03ca-731e-b4e7-d959d8162ccb	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:10:01	2026-07-02 15:10:01	\N
019f2408-7951-732c-9e2d-ac5a89be1af4	019f2408-7937-7124-9e26-c742ab05af5f	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:12:42	2026-07-02 15:12:42	\N
019f240a-74d1-7128-9765-f940e8a3bc08	019f240a-74af-73dd-857a-149822fe001b	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:14:52	2026-07-02 15:14:52	\N
019f240d-c830-73a2-933e-630f31e8c408	019f240d-c80e-72b7-b56f-ef5b303a29aa	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:18:30	2026-07-02 15:18:30	\N
019f240e-f9b0-73f3-b8a8-e0ce30632c92	019f240e-f987-7154-9fd2-ee9f250e384b	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:19:49	2026-07-02 15:19:49	\N
019f241c-e5a5-7108-ad60-31dfc72d6c88	019f241c-e4e8-713d-9331-4cb794c1a10c	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:35:01	2026-07-02 15:35:01	\N
019f241f-9e04-72cc-85d3-503cf79e331b	019f241f-9dcf-703f-a8cc-82faa1c4a5a7	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:37:59	2026-07-02 15:37:59	\N
019f2421-7c7a-7373-bf79-4b56d57041f3	019f2421-7c56-7289-8831-099c868282db	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:40:02	2026-07-02 15:40:02	\N
019f2423-b011-7367-a862-5eb38aea4c87	019f2423-afe8-7058-a7dd-f11789ebd598	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:42:26	2026-07-02 15:42:26	\N
019f2425-4a96-73d3-ba1c-c03e9dbdfc3d	019f2425-4a62-71b3-9f4d-fd22768cfc12	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:44:11	2026-07-02 15:44:11	\N
019f2426-9788-72fd-aac2-6bb52ace3a71	019f2426-976a-73bc-8feb-fb033192f832	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:45:36	2026-07-02 15:45:36	\N
019f2427-8749-7209-9dc4-20046ca1c265	019f2427-8730-713b-aa9b-320ce0d3342e	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:46:38	2026-07-02 15:46:38	\N
019f2428-cfd2-7044-85c8-dff526f0481f	019f2428-cf58-72cb-9d4d-5d4b255c329f	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:48:02	2026-07-02 15:48:02	\N
019f2429-89ce-73f3-a57b-fb5d354a3c48	019f2429-89ad-716b-b1ec-3fbdb7f96ba2	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:48:49	2026-07-02 15:48:49	\N
019f242a-f88b-70ff-9c91-081e635af53d	019f242a-f86f-70ff-9c6e-c80dc9a3ef76	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:50:23	2026-07-02 15:50:23	\N
019f242d-966d-7147-9a65-e3a037fa220e	019f242d-9652-70eb-b7f5-9d6ed25bdce3	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:53:15	2026-07-02 15:53:15	\N
019f242f-2846-7205-adc8-a1a5b79e28b3	019f242f-282a-7079-a7d7-a80727513a91	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:54:58	2026-07-02 15:54:58	\N
019f2430-b0e1-7377-9bb0-87d2660953a4	019f2430-b0a5-7168-99e2-09976a758ec7	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:56:38	2026-07-02 15:56:38	\N
019f2433-82fb-737d-ba3f-c86435a22bf8	019f2433-82e1-72dd-b6b4-8bc045fd7576	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 15:59:43	2026-07-02 15:59:43	\N
019f2434-6f84-73ab-9205-9ed887ac014e	019f2434-6f67-7332-8c69-ace3defb4a53	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:00:44	2026-07-02 16:00:44	\N
019f2435-80e3-72a2-ab72-65c1dc8fabda	019f2435-80b5-70be-ab51-c221666b406e	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:01:54	2026-07-02 16:01:54	\N
019f2436-ff33-707b-8777-457e4d1d1bc8	019f2436-fefc-7357-950c-f69baadedaef	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:03:31	2026-07-02 16:03:31	\N
019f2438-0e7c-737f-ab25-fb50ba389a63	019f2438-0e60-7065-958b-8abb179113aa	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:04:41	2026-07-02 16:04:41	\N
019f2439-296c-721d-ab8f-a0e7462a866b	019f2439-2956-72a4-9af9-146653403346	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:05:53	2026-07-02 16:05:53	\N
019f243a-58d3-73fa-afdc-b6cba2c16ef1	019f243a-58b2-733b-b14a-c57263f12319	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:07:11	2026-07-02 16:07:11	\N
019f243b-6ea5-702c-9865-72d543f60944	019f243b-6e89-71a8-aeb0-a23061a21981	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:08:22	2026-07-02 16:08:22	\N
019f243c-5471-7122-b17d-02e89b361c85	019f243c-5459-7395-85e8-00bdb60348d5	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:09:21	2026-07-02 16:09:21	\N
019f243e-7d1a-701b-bcfc-9fb5ca62a6fe	019f243e-7cf8-729a-8105-6fc7c7eeb656	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:11:42	2026-07-02 16:11:42	\N
019f243f-b48c-72f6-8ada-a8e84727f59c	019f243f-b46d-737f-b478-99d82ec8f5c0	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:13:02	2026-07-02 16:13:02	\N
019f246e-b8ea-73a2-aca1-af26bd172c3f	019f246e-b89c-7370-9d32-c18d1f44ed20	alugado	\N	35000	t	t	t	\N	f	\N	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f2467-9bbc-72eb-8c3e-dc2090a205dc	019f2467-9b5c-7175-a77e-a718ede6b1a7	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f248e-bac1-71ad-a8bc-7b3aa5ab972c	019f248e-baa6-7148-9db4-d3d468da4a95	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 17:39:21	2026-07-02 17:39:21	\N
019f2495-d8de-73b0-8685-6431da411652	019f2495-d8be-7284-a9d4-1e72bda0ca2d	\N	\N	\N	f	f	f	\N	f	\N	2026-07-02 17:47:07	2026-07-02 17:47:07	\N
019f298b-dd96-709e-bca2-2c653501ddbd	019f298b-dd42-72da-a454-ba7943289e0c	proprio	\N	\N	t	t	t	\N	f	\N	2026-07-03 16:54:19	2026-07-03 16:57:28	\N
019f3882-5874-7079-a856-edde105e700c	019f3882-5836-702a-8f3a-e31bfe5a8392	\N	\N	\N	f	f	f	\N	f	\N	2026-07-06 14:38:14	2026-07-06 14:38:14	\N
019fc8b1-9e82-721c-bb02-01b659e65807	019fc8b1-9e40-7258-bc42-6c5502e495b7	\N	\N	\N	f	f	f	\N	f	\N	2026-08-03 14:35:11	2026-08-03 14:35:11	\N
019fdd22-e16d-70bb-8129-4c86f6c3413f	019fdd22-e121-7093-8603-1c5da640d3b9	cedido	\N	\N	t	t	t	23662848984	t	Bolsa Familia do Enzzo	2026-08-07 13:51:18	2026-08-07 13:51:18	\N
01a0166a-03e2-734d-81ac-e0006c6fbd05	01a0166a-0339-700d-9eb9-519b80b05c1b	\N	\N	\N	f	f	f	\N	f	\N	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a034bb-d340-7032-a65d-36d97ad8a067	01a034bb-d2df-70fc-ba01-d309f32df657	proprio	\N	\N	t	t	t	\N	f	\N	2026-08-24 14:05:19	2026-08-24 14:05:19	\N
01a0443f-8377-71eb-a622-51839cb6820a	01a0443f-8330-7233-ad2d-ade67d6262d5	alugado	\N	\N	t	t	t	20308583447	t	\N	2026-08-27 14:23:28	2026-08-27 14:23:28	\N
01a04445-f3df-715c-a59a-802a1b28814f	01a04445-f3c5-7234-baad-000c79bc9a6b	alugado	\N	\N	t	t	t	13002503389	f	\N	2026-08-27 14:30:30	2026-08-27 14:30:30	\N
01a04451-04b4-7327-aa49-bbf333857b0f	01a04451-046d-725f-a23c-fad397c4b95c	alugado	\N	\N	t	t	t	13002503389	f	\N	2026-08-27 14:42:35	2026-08-27 14:42:35	\N
01a0449d-89de-724a-a20f-4ce6bb6760ff	01a0449d-87ed-7162-994a-1027af7499a0	\N	\N	\N	f	f	f	\N	f	\N	2026-08-27 16:06:10	2026-08-27 16:06:10	\N
01a0b563-5466-70c4-a54f-e4e3e11125b7	01a0b563-5427-723a-812a-0f175368a841	\N	\N	\N	f	f	f	\N	f	\N	2026-09-18 13:39:40	2026-09-18 13:39:40	\N
01a0b55f-d579-72c7-8372-885e174e3107	01a0b55f-d535-7259-9c00-4a8ef2486221	\N	\N	\N	f	f	f	\N	f	\N	2026-09-18 13:35:51	2026-09-18 13:40:08	2026-09-18 13:40:08
01a0d954-e913-73d9-b188-fb72bcba6f3c	01a0d954-e883-720d-b7ea-3e68db80d027	\N	\N	\N	f	f	f	\N	f	\N	2026-09-25 13:10:15	2026-09-25 13:10:15	\N
01a0da50-206e-710c-828e-118965c3716e	01a0da50-2002-7370-87c4-2a6b32841190	\N	\N	\N	f	f	f	\N	f	\N	2026-09-25 17:44:39	2026-09-25 17:44:39	\N
01a10dc0-d8fc-73ad-afd4-2b41c3fcf608	01a10dc0-d890-73a0-9107-98fd25a324ef	\N	\N	\N	f	f	f	\N	f	\N	2026-10-05 17:28:24	2026-10-05 17:28:24	\N
01a12207-d5d8-72b0-b2c9-58ad9502f69e	01a12207-d572-7227-a89e-9f11da7b3920	\N	\N	\N	f	f	f	\N	f	\N	2026-10-09 15:58:21	2026-10-09 15:58:21	\N
01a13673-e1ed-7374-8e92-cfcf5d437f3b	01a13673-e182-70e4-b8d5-b9832d4783ca	alugado	\N	50000	t	t	t	5759887548	f	\N	2026-10-13 15:08:46	2026-10-13 15:19:26	\N
01a155ae-6787-7344-bc6c-52650bd1ea9f	01a155ae-66e2-718d-bbe7-f70fac829f36	\N	\N	\N	f	f	f	\N	f	\N	2026-10-19 16:40:55	2026-10-19 16:40:55	\N
\.


--
-- Data for Name: participant_observations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participant_observations (id, participant_id, notes, created_at, updated_at, deleted_at) FROM stdin;
019eaabc-301e-71a1-af89-fe486a753d61	019ea894-9707-71dd-9448-f213e631ac55	\N	2026-06-09 01:55:20	2026-06-09 01:55:20	\N
019ead93-1a75-70bd-a140-5e794948ab33	019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	\N	2026-06-09 15:09:19	2026-06-09 15:09:19	\N
019eaf18-2c5b-707d-929d-b51c1dc06f24	019ea83c-cd1e-7115-a782-580ff6e2df46	\N	2026-06-09 22:14:17	2026-06-09 22:14:17	\N
019efff0-a169-73d7-a86f-6e1d6fe46285	019efff0-a100-7079-958e-eff405049f6e	\N	2026-06-25 15:00:20	2026-06-25 15:00:20	\N
019f23cf-d29a-72a4-abea-5b85c1142a78	019f23cf-d26e-72e4-a177-4aa236ea8020	\N	2026-07-02 14:10:50	2026-07-02 14:10:50	\N
019f23d2-0f91-72f4-b47e-07fd09965541	019f23d2-0f65-72c1-b310-f08055930c63	\N	2026-07-02 14:13:16	2026-07-02 14:13:16	\N
019f23d4-b369-7306-9569-3567d2da993a	019f23d4-b33e-7017-9c6c-1e52905168dc	\N	2026-07-02 14:16:09	2026-07-02 14:16:09	\N
019f23d6-29ce-70f1-9aec-1243ca50f8bd	019f23d6-29ab-73f7-ae5f-6bb340ad0b01	\N	2026-07-02 14:17:45	2026-07-02 14:17:45	\N
019f23d8-7915-731e-9ee6-4d99a21b4901	019f23d8-78d0-72c9-bbce-9977a6845797	\N	2026-07-02 14:20:17	2026-07-02 14:20:17	\N
019f23da-5b8c-7094-8eaa-c2d33a7d2248	019f23da-5b6b-7138-a534-7bd65a738ab9	\N	2026-07-02 14:22:20	2026-07-02 14:22:20	\N
019f23dc-1471-706b-acae-b8495485996f	019f23dc-1445-72de-8c78-c1b27fa4987f	\N	2026-07-02 14:24:13	2026-07-02 14:24:13	\N
019f23dd-dcf5-71a3-bd4c-078c6dfcabbf	019f23dd-dccd-7011-82e6-090a2eb2f684	\N	2026-07-02 14:26:10	2026-07-02 14:26:10	\N
019f23df-7a3b-71c0-b53b-930f7ac8de9b	019f23df-7a16-71c4-972a-55fa6cd94199	\N	2026-07-02 14:27:56	2026-07-02 14:27:56	\N
019f23e1-9aa3-7169-89e7-667ea424bb87	019f23e1-9a76-73e7-975b-b6f978a9ef40	\N	2026-07-02 14:30:15	2026-07-02 14:30:15	\N
019f23e3-21da-73bd-94b4-da8b5dae2631	019f23e3-21b9-702d-9b9b-2ad7c4316d7d	\N	2026-07-02 14:31:55	2026-07-02 14:31:55	\N
019f23e5-dbbe-7202-99da-eb98a9ef2664	019f23e5-db97-72a5-8029-abfa9f328ed5	\N	2026-07-02 14:34:54	2026-07-02 14:34:54	\N
019f23ed-101c-70fb-93e6-1cb6c551625c	019f23ed-0ff6-71cf-a6ca-fe8b37735aa2	\N	2026-07-02 14:42:46	2026-07-02 14:42:46	\N
019f23ef-131c-71b2-8f18-eaf3e8da7556	019f23ef-12f2-73d4-8239-258c964bd778	\N	2026-07-02 14:44:58	2026-07-02 14:44:58	\N
019f23ef-9b0f-7211-92eb-5dbedcfb5afe	019f23ef-9aec-703d-b404-c6f70cc7fd60	\N	2026-07-02 14:45:33	2026-07-02 14:45:55	2026-07-02 14:45:55
019f23f2-a3f9-71af-a1d8-6c4b2e75ff4e	019f23f2-a3ce-7373-a015-7f7b20e51e2a	\N	2026-07-02 14:48:52	2026-07-02 14:48:52	\N
019f23f4-b7ff-7028-99ff-11f73b63b61a	019f23f4-b7da-7012-890b-794942d0af42	\N	2026-07-02 14:51:08	2026-07-02 14:51:08	\N
019f23f6-2843-722d-b45a-05092cca8565	019f23f6-281b-73cd-b1d0-420531076382	\N	2026-07-02 14:52:42	2026-07-02 14:52:42	\N
019f23fc-6a22-7127-96a3-bbfcc3c80006	019f23fc-69f6-72f2-a0de-0cd9261fd295	\N	2026-07-02 14:59:32	2026-07-02 14:59:32	\N
019f23fe-aafa-71b2-9d9e-e6b08e071e45	019f23fe-aac7-7165-88a1-789edb82ede3	\N	2026-07-02 15:02:00	2026-07-02 15:02:00	\N
019f2404-7963-7302-9677-67df8b831963	019f2404-7939-7034-931f-46ad4c880cd9	\N	2026-07-02 15:08:20	2026-07-02 15:08:20	\N
019f2406-0446-70b3-a231-6a0332fe9220	019f2406-03ca-731e-b4e7-d959d8162ccb	\N	2026-07-02 15:10:01	2026-07-02 15:10:01	\N
019f2408-795b-7071-8e22-1d596300f2ef	019f2408-7937-7124-9e26-c742ab05af5f	\N	2026-07-02 15:12:42	2026-07-02 15:12:42	\N
019f240a-74dd-7038-9d21-a68040203aa1	019f240a-74af-73dd-857a-149822fe001b	\N	2026-07-02 15:14:52	2026-07-02 15:14:52	\N
019f240d-c83a-72e2-bd0d-2e3507ce52e3	019f240d-c80e-72b7-b56f-ef5b303a29aa	\N	2026-07-02 15:18:30	2026-07-02 15:18:30	\N
019f240e-f9bd-705e-bfc9-ec7bead2c813	019f240e-f987-7154-9fd2-ee9f250e384b	\N	2026-07-02 15:19:49	2026-07-02 15:19:49	\N
019f241c-e60c-71f1-91eb-c98e9e33a00a	019f241c-e4e8-713d-9331-4cb794c1a10c	\N	2026-07-02 15:35:01	2026-07-02 15:35:01	\N
019f241f-9e13-719b-a589-73dcf72c7b7a	019f241f-9dcf-703f-a8cc-82faa1c4a5a7	\N	2026-07-02 15:37:59	2026-07-02 15:37:59	\N
019f2421-7c88-7273-873d-8f591fcafd71	019f2421-7c56-7289-8831-099c868282db	\N	2026-07-02 15:40:02	2026-07-02 15:40:02	\N
019f2423-b01e-731f-88ed-511cb399aac5	019f2423-afe8-7058-a7dd-f11789ebd598	\N	2026-07-02 15:42:26	2026-07-02 15:42:26	\N
019f2425-4aa6-720f-a432-8396c27249f0	019f2425-4a62-71b3-9f4d-fd22768cfc12	\N	2026-07-02 15:44:11	2026-07-02 15:44:11	\N
019f2426-9793-711e-839c-211c55ba99fb	019f2426-976a-73bc-8feb-fb033192f832	\N	2026-07-02 15:45:36	2026-07-02 15:45:36	\N
019f2427-8753-70f1-b159-a4a2987e4d40	019f2427-8730-713b-aa9b-320ce0d3342e	\N	2026-07-02 15:46:38	2026-07-02 15:46:38	\N
019f2428-cfe3-7365-847a-0af0b457ef00	019f2428-cf58-72cb-9d4d-5d4b255c329f	\N	2026-07-02 15:48:02	2026-07-02 15:48:02	\N
019f2429-89da-7177-b5bd-3a381bc3e882	019f2429-89ad-716b-b1ec-3fbdb7f96ba2	\N	2026-07-02 15:48:49	2026-07-02 15:48:49	\N
019f242a-f893-70e2-aaa4-f117d38bc517	019f242a-f86f-70ff-9c6e-c80dc9a3ef76	\N	2026-07-02 15:50:23	2026-07-02 15:50:23	\N
019f242d-9676-705a-bc01-8335f57417ba	019f242d-9652-70eb-b7f5-9d6ed25bdce3	\N	2026-07-02 15:53:15	2026-07-02 15:53:15	\N
019f242f-2854-7333-a21e-d0587ce4a4a8	019f242f-282a-7079-a7d7-a80727513a91	\N	2026-07-02 15:54:58	2026-07-02 15:54:58	\N
019f2430-b0ea-7093-9f51-36a43f1f73e0	019f2430-b0a5-7168-99e2-09976a758ec7	\N	2026-07-02 15:56:38	2026-07-02 15:56:38	\N
019f2433-8302-7256-9a7e-e1dc6170fcbc	019f2433-82e1-72dd-b6b4-8bc045fd7576	\N	2026-07-02 15:59:43	2026-07-02 15:59:43	\N
019f2434-6f8e-7214-a8be-1fa311b1a946	019f2434-6f67-7332-8c69-ace3defb4a53	\N	2026-07-02 16:00:44	2026-07-02 16:00:44	\N
019f2435-80ec-72e0-b647-a1e3cf4f7cb3	019f2435-80b5-70be-ab51-c221666b406e	\N	2026-07-02 16:01:54	2026-07-02 16:01:54	\N
019f2436-ff41-73e0-8f6c-2475be28c567	019f2436-fefc-7357-950c-f69baadedaef	\N	2026-07-02 16:03:31	2026-07-02 16:03:31	\N
019f2438-0e84-7099-8c43-5c14ceb795d8	019f2438-0e60-7065-958b-8abb179113aa	\N	2026-07-02 16:04:41	2026-07-02 16:04:41	\N
019f2439-2973-703a-90d1-49cb3c22cb09	019f2439-2956-72a4-9af9-146653403346	\N	2026-07-02 16:05:53	2026-07-02 16:05:53	\N
019f243a-58de-7373-9189-80a16e34d2d0	019f243a-58b2-733b-b14a-c57263f12319	\N	2026-07-02 16:07:11	2026-07-02 16:07:11	\N
019f243b-6eae-7125-9cc6-dd9aeb348f89	019f243b-6e89-71a8-aeb0-a23061a21981	\N	2026-07-02 16:08:22	2026-07-02 16:08:22	\N
019f243c-5479-719d-ab8f-c439bbce8822	019f243c-5459-7395-85e8-00bdb60348d5	\N	2026-07-02 16:09:21	2026-07-02 16:09:21	\N
019f243e-7d24-72e0-ba79-898102c13184	019f243e-7cf8-729a-8105-6fc7c7eeb656	\N	2026-07-02 16:11:42	2026-07-02 16:11:42	\N
019f243f-b496-73d0-ae50-6815008e6e5a	019f243f-b46d-737f-b478-99d82ec8f5c0	\N	2026-07-02 16:13:02	2026-07-02 16:13:02	\N
019f246e-b8fa-71d7-adc0-93f0d424cac5	019f246e-b89c-7370-9d32-c18d1f44ed20	\N	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f2467-9bc5-737a-a835-12c503d4bb39	019f2467-9b5c-7175-a77e-a718ede6b1a7	\N	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f248e-bac9-7376-ab3e-4cc71aed75a3	019f248e-baa6-7148-9db4-d3d468da4a95	\N	2026-07-02 17:39:21	2026-07-02 17:39:21	\N
019f2495-d8e8-710c-810a-a1f1f5189769	019f2495-d8be-7284-a9d4-1e72bda0ca2d	\N	2026-07-02 17:47:08	2026-07-02 17:47:08	\N
019f298b-dda1-7338-ad20-54b8525b794f	019f298b-dd42-72da-a454-ba7943289e0c	\N	2026-07-03 16:54:19	2026-07-03 16:54:19	\N
019f3882-587f-70ed-8bcc-db194e578050	019f3882-5836-702a-8f3a-e31bfe5a8392	\N	2026-07-06 14:38:14	2026-07-06 14:38:14	\N
019fc8b1-9e8f-73ca-8f71-9f6b3e30b57e	019fc8b1-9e40-7258-bc42-6c5502e495b7	\N	2026-08-03 14:35:11	2026-08-03 14:35:11	\N
019fdd22-e178-70f3-b4d3-18c039756da6	019fdd22-e121-7093-8603-1c5da640d3b9	\N	2026-08-07 13:51:18	2026-08-07 13:51:18	\N
01a0166a-03f2-70c2-a81e-4b1bbea42a2e	01a0166a-0339-700d-9eb9-519b80b05c1b	\N	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a034bb-d34e-7134-b0da-a20801f30412	01a034bb-d2df-70fc-ba01-d309f32df657	\N	2026-08-24 14:05:19	2026-08-24 14:05:19	\N
01a0443f-8385-71d0-ada1-d844b5a4af29	01a0443f-8330-7233-ad2d-ade67d6262d5	\N	2026-08-27 14:23:28	2026-08-27 14:23:28	\N
01a04445-f3e9-72ca-a94b-6774f7515023	01a04445-f3c5-7234-baad-000c79bc9a6b	\N	2026-08-27 14:30:30	2026-08-27 14:30:30	\N
01a04451-04c1-719b-98cf-25c46b62346b	01a04451-046d-725f-a23c-fad397c4b95c	\N	2026-08-27 14:42:35	2026-08-27 14:42:35	\N
01a0449d-8a24-713d-8ae0-273bbced4aa0	01a0449d-87ed-7162-994a-1027af7499a0	\N	2026-08-27 16:06:10	2026-08-27 16:06:10	\N
01a0b563-5472-709a-8794-b5c457313143	01a0b563-5427-723a-812a-0f175368a841	\N	2026-09-18 13:39:40	2026-09-18 13:39:40	\N
01a0b55f-d586-72f5-a890-6c43f7a3768d	01a0b55f-d535-7259-9c00-4a8ef2486221	\N	2026-09-18 13:35:51	2026-09-18 13:40:08	2026-09-18 13:40:08
01a0d954-e923-714c-8968-dae257ee27b5	01a0d954-e883-720d-b7ea-3e68db80d027	\N	2026-09-25 13:10:15	2026-09-25 13:10:15	\N
01a0da50-207d-7376-90f2-f5115ec2c73d	01a0da50-2002-7370-87c4-2a6b32841190	\N	2026-09-25 17:44:39	2026-09-25 17:44:39	\N
01a10dc0-d907-71ed-ba59-8be7414025ee	01a10dc0-d890-73a0-9107-98fd25a324ef	\N	2026-10-05 17:28:24	2026-10-05 17:28:24	\N
01a12207-d5e6-739f-88d8-2450e44c828c	01a12207-d572-7227-a89e-9f11da7b3920	\N	2026-10-09 15:58:21	2026-10-09 15:58:21	\N
01a13673-e1fb-732c-9b85-d8298d5160c7	01a13673-e182-70e4-b8d5-b9832d4783ca	INICIO EM JANEIRO DE 2027, FALTA FAZER E PREENCHER TERMO DE IMAGEM	2026-10-13 15:08:46	2026-10-13 15:22:10	\N
01a155ae-6796-73ec-bf5e-bae51cca640f	01a155ae-66e2-718d-bbe7-f70fac829f36	\N	2026-10-19 16:40:55	2026-10-19 16:40:55	\N
\.


--
-- Data for Name: participant_schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participant_schools (id, participant_id, school_name, period, grade, created_at, updated_at, deleted_at) FROM stdin;
019eaabc-2fea-7160-9e9a-62885e79f1f2	019ea894-9707-71dd-9448-f213e631ac55	\N	\N	\N	2026-06-09 01:55:20	2026-06-09 01:55:20	\N
019ead93-1a24-72dc-b881-397aa9b99a1d	019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	\N	\N	\N	2026-06-09 15:09:19	2026-06-09 15:10:03	\N
019eaf18-2c26-71b5-b91a-0be7c4b5a611	019ea83c-cd1e-7115-a782-580ff6e2df46	\N	\N	\N	2026-06-09 22:14:17	2026-06-09 22:14:17	\N
019efff0-a137-707f-9922-1dad41f7e01e	019efff0-a100-7079-958e-eff405049f6e	\N	\N	\N	2026-06-25 15:00:20	2026-06-25 15:00:20	\N
019f23cf-d275-7318-89e7-34690008b526	019f23cf-d26e-72e4-a177-4aa236ea8020	\N	\N	\N	2026-07-02 14:10:50	2026-07-02 14:10:50	\N
019f23d2-0f6b-70f9-97b4-8cb79bb71ed8	019f23d2-0f65-72c1-b310-f08055930c63	\N	\N	\N	2026-07-02 14:13:16	2026-07-02 14:13:16	\N
019f23d4-b343-71a2-8728-05b18a782114	019f23d4-b33e-7017-9c6c-1e52905168dc	\N	\N	\N	2026-07-02 14:16:09	2026-07-02 14:16:09	\N
019f23d6-29b1-705c-94c5-6eab4e91f43d	019f23d6-29ab-73f7-ae5f-6bb340ad0b01	\N	\N	\N	2026-07-02 14:17:45	2026-07-02 14:17:45	\N
019f23d8-78d9-7359-9387-31d2825ea804	019f23d8-78d0-72c9-bbce-9977a6845797	\N	\N	\N	2026-07-02 14:20:17	2026-07-02 14:20:17	\N
019f23da-5b70-7070-963c-454ce9438001	019f23da-5b6b-7138-a534-7bd65a738ab9	\N	\N	\N	2026-07-02 14:22:20	2026-07-02 14:22:20	\N
019f23dc-144d-729a-b1f8-ec3093c1d8ac	019f23dc-1445-72de-8c78-c1b27fa4987f	\N	\N	\N	2026-07-02 14:24:13	2026-07-02 14:24:13	\N
019f23dd-dcd3-703c-93a5-5182b6572fd3	019f23dd-dccd-7011-82e6-090a2eb2f684	\N	\N	\N	2026-07-02 14:26:10	2026-07-02 14:26:10	\N
019f23df-7a1a-7339-9b9b-561fceb622a1	019f23df-7a16-71c4-972a-55fa6cd94199	\N	\N	\N	2026-07-02 14:27:56	2026-07-02 14:27:56	\N
019f23e1-9a7c-7103-8710-68339aaf132f	019f23e1-9a76-73e7-975b-b6f978a9ef40	\N	\N	\N	2026-07-02 14:30:15	2026-07-02 14:30:15	\N
019f23e3-21be-7323-a5b4-677ffb8d5bdc	019f23e3-21b9-702d-9b9b-2ad7c4316d7d	\N	\N	\N	2026-07-02 14:31:55	2026-07-02 14:31:55	\N
019f23e5-db9c-7074-812e-50172f151cca	019f23e5-db97-72a5-8029-abfa9f328ed5	\N	\N	\N	2026-07-02 14:34:54	2026-07-02 14:34:54	\N
019f23ed-1001-70db-9455-a4d25deb6fbe	019f23ed-0ff6-71cf-a6ca-fe8b37735aa2	\N	\N	\N	2026-07-02 14:42:46	2026-07-02 14:42:46	\N
019f23ef-12f8-718b-977f-0144f88d69e4	019f23ef-12f2-73d4-8239-258c964bd778	\N	\N	\N	2026-07-02 14:44:58	2026-07-02 14:44:58	\N
019f23ef-9af1-7245-8484-211196efe066	019f23ef-9aec-703d-b404-c6f70cc7fd60	\N	\N	\N	2026-07-02 14:45:33	2026-07-02 14:45:55	2026-07-02 14:45:55
019f23f2-a3d6-739c-9d79-f72ca3ae7fcd	019f23f2-a3ce-7373-a015-7f7b20e51e2a	\N	\N	\N	2026-07-02 14:48:52	2026-07-02 14:48:52	\N
019f23f4-b7df-7262-93c5-85a7a3f656b3	019f23f4-b7da-7012-890b-794942d0af42	\N	\N	\N	2026-07-02 14:51:08	2026-07-02 14:51:08	\N
019f23f6-2821-716f-a758-b26ab374991f	019f23f6-281b-73cd-b1d0-420531076382	\N	\N	\N	2026-07-02 14:52:42	2026-07-02 14:52:42	\N
019f23fc-69fe-719f-8d5f-4d9f0cd10e04	019f23fc-69f6-72f2-a0de-0cd9261fd295	\N	\N	\N	2026-07-02 14:59:32	2026-07-02 14:59:32	\N
019f23fe-aad0-72ea-a8e0-07630e5f06f0	019f23fe-aac7-7165-88a1-789edb82ede3	\N	\N	\N	2026-07-02 15:02:00	2026-07-02 15:02:00	\N
019f2404-793e-72c0-a512-f9a70aed733a	019f2404-7939-7034-931f-46ad4c880cd9	\N	\N	\N	2026-07-02 15:08:20	2026-07-02 15:08:20	\N
019f2406-03d4-716e-9cf8-042b6807e7eb	019f2406-03ca-731e-b4e7-d959d8162ccb	\N	\N	\N	2026-07-02 15:10:01	2026-07-02 15:10:01	\N
019f2408-793c-70ff-a9dc-b3088a6cb719	019f2408-7937-7124-9e26-c742ab05af5f	\N	\N	\N	2026-07-02 15:12:42	2026-07-02 15:12:42	\N
019f240a-74b5-70a5-a5fe-396f95deaad1	019f240a-74af-73dd-857a-149822fe001b	\N	\N	\N	2026-07-02 15:14:52	2026-07-02 15:14:52	\N
019f240d-c814-7336-bac3-5081db05ca37	019f240d-c80e-72b7-b56f-ef5b303a29aa	\N	\N	\N	2026-07-02 15:18:30	2026-07-02 15:18:30	\N
019f240e-f98d-71ff-a31e-b3e03326630f	019f240e-f987-7154-9fd2-ee9f250e384b	\N	\N	\N	2026-07-02 15:19:49	2026-07-02 15:19:49	\N
019f241c-e501-7190-8047-bee556fabf8d	019f241c-e4e8-713d-9331-4cb794c1a10c	\N	\N	\N	2026-07-02 15:35:01	2026-07-02 15:35:01	\N
019f241f-9dd7-714d-aa2b-26f0f89ebd46	019f241f-9dcf-703f-a8cc-82faa1c4a5a7	\N	\N	\N	2026-07-02 15:37:59	2026-07-02 15:37:59	\N
019f2421-7c5e-72e5-b9ab-2bdc90145baa	019f2421-7c56-7289-8831-099c868282db	\N	\N	\N	2026-07-02 15:40:02	2026-07-02 15:40:02	\N
019f2423-afee-734d-8788-346c796136f4	019f2423-afe8-7058-a7dd-f11789ebd598	\N	\N	\N	2026-07-02 15:42:26	2026-07-02 15:42:26	\N
019f2425-4a6a-724c-8c17-4707276f4c3d	019f2425-4a62-71b3-9f4d-fd22768cfc12	\N	\N	\N	2026-07-02 15:44:11	2026-07-02 15:44:11	\N
019f2426-976f-7286-883b-ce3cafae0bac	019f2426-976a-73bc-8feb-fb033192f832	\N	\N	\N	2026-07-02 15:45:36	2026-07-02 15:45:36	\N
019f2427-8734-70c2-9b6d-b1f3d27e663e	019f2427-8730-713b-aa9b-320ce0d3342e	\N	\N	\N	2026-07-02 15:46:38	2026-07-02 15:46:38	\N
019f2428-cf62-7034-afdf-5b347eec7f1c	019f2428-cf58-72cb-9d4d-5d4b255c329f	\N	\N	\N	2026-07-02 15:48:02	2026-07-02 15:48:02	\N
019f2429-89b5-73f2-9e06-2963126109ba	019f2429-89ad-716b-b1ec-3fbdb7f96ba2	\N	\N	\N	2026-07-02 15:48:49	2026-07-02 15:48:49	\N
019f242a-f876-71a6-b235-eb17b3cdbf76	019f242a-f86f-70ff-9c6e-c80dc9a3ef76	\N	\N	\N	2026-07-02 15:50:23	2026-07-02 15:50:23	\N
019f242d-9657-7177-b1d3-e3f9dd60886c	019f242d-9652-70eb-b7f5-9d6ed25bdce3	\N	\N	\N	2026-07-02 15:53:15	2026-07-02 15:53:15	\N
019f242f-2830-73d9-84e6-f9b99f5b78dd	019f242f-282a-7079-a7d7-a80727513a91	\N	\N	\N	2026-07-02 15:54:58	2026-07-02 15:54:58	\N
019f2430-b0c8-71a3-b64c-be43c63300ad	019f2430-b0a5-7168-99e2-09976a758ec7	\N	\N	\N	2026-07-02 15:56:38	2026-07-02 15:56:38	\N
019f2433-82e5-714a-af7e-c3d39dba2244	019f2433-82e1-72dd-b6b4-8bc045fd7576	\N	\N	\N	2026-07-02 15:59:43	2026-07-02 15:59:43	\N
019f2434-6f6c-718b-98f9-d62e56f5cb8d	019f2434-6f67-7332-8c69-ace3defb4a53	\N	\N	\N	2026-07-02 16:00:44	2026-07-02 16:00:44	\N
019f2435-80bb-73ba-b1ca-0afd207c8834	019f2435-80b5-70be-ab51-c221666b406e	\N	\N	\N	2026-07-02 16:01:53	2026-07-02 16:01:53	\N
019f2436-ff07-701f-b3f4-747f8b7d7691	019f2436-fefc-7357-950c-f69baadedaef	\N	\N	\N	2026-07-02 16:03:31	2026-07-02 16:03:31	\N
019f2438-0e65-71e1-8dfd-02ed2427ef59	019f2438-0e60-7065-958b-8abb179113aa	\N	\N	\N	2026-07-02 16:04:41	2026-07-02 16:04:41	\N
019f2439-295a-7260-ae4e-9aeb0321b5c9	019f2439-2956-72a4-9af9-146653403346	\N	\N	\N	2026-07-02 16:05:53	2026-07-02 16:05:53	\N
019f243a-58bb-70c0-b1bf-e157d55bbaaf	019f243a-58b2-733b-b14a-c57263f12319	\N	\N	\N	2026-07-02 16:07:11	2026-07-02 16:07:11	\N
019f243b-6e8e-70ae-a9c3-ed1daa1239eb	019f243b-6e89-71a8-aeb0-a23061a21981	\N	\N	\N	2026-07-02 16:08:22	2026-07-02 16:08:22	\N
019f243c-545e-7284-aaf9-a82cb1123d90	019f243c-5459-7395-85e8-00bdb60348d5	\N	\N	\N	2026-07-02 16:09:21	2026-07-02 16:09:21	\N
019f243e-7cfe-7189-b127-39eac309c744	019f243e-7cf8-729a-8105-6fc7c7eeb656	\N	\N	\N	2026-07-02 16:11:42	2026-07-02 16:11:42	\N
019f243f-b474-733a-8f40-e1409c5fa200	019f243f-b46d-737f-b478-99d82ec8f5c0	\N	\N	\N	2026-07-02 16:13:02	2026-07-02 16:13:02	\N
019f246e-b8be-70aa-9a82-bcf0a111566c	019f246e-b89c-7370-9d32-c18d1f44ed20	Joaquim	integral	3 ano	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f2467-9b63-72cb-b667-336ee1430961	019f2467-9b5c-7175-a77e-a718ede6b1a7	Joaquim	integral	3 Ano	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f248e-baac-732a-9515-9fca6db9611f	019f248e-baa6-7148-9db4-d3d468da4a95	\N	\N	\N	2026-07-02 17:39:21	2026-07-02 17:39:21	\N
019f2495-d8ca-7149-a7f6-c9cb45126fb2	019f2495-d8be-7284-a9d4-1e72bda0ca2d	\N	\N	\N	2026-07-02 17:47:07	2026-07-02 17:47:07	\N
019f298b-dd52-720c-84c6-bedc5ebf7f16	019f298b-dd42-72da-a454-ba7943289e0c	Sesi	integral	5 ano	2026-07-03 16:54:19	2026-07-03 16:54:19	\N
019f3882-585a-7156-83bb-6512fd088d13	019f3882-5836-702a-8f3a-e31bfe5a8392	\N	\N	\N	2026-07-06 14:38:14	2026-07-06 14:38:14	\N
019fc8b1-9e66-7115-948c-b18cd7d0bcb1	019fc8b1-9e40-7258-bc42-6c5502e495b7	\N	\N	\N	2026-08-03 14:35:11	2026-08-03 14:35:11	\N
019fdd22-e131-735b-8fda-434b86928f76	019fdd22-e121-7093-8603-1c5da640d3b9	Consuelo	integral	7 Ano	2026-08-07 13:51:18	2026-08-07 13:51:18	\N
01a0166a-036f-73ec-b229-8454cd46b55e	01a0166a-0339-700d-9eb9-519b80b05c1b	Leitão	integral	7 ano	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a034bb-d313-703c-a292-a42e96e77d0f	01a034bb-d2df-70fc-ba01-d309f32df657	\N	\N	\N	2026-08-24 14:05:19	2026-08-24 14:05:19	\N
01a0443f-8356-71f1-baaa-7855c16dc3d2	01a0443f-8330-7233-ad2d-ade67d6262d5	Jacinto de oliveira	integral	2 ano	2026-08-27 14:23:28	2026-08-27 14:23:28	\N
01a04445-f3ca-705e-95d8-d2468e33975f	01a04445-f3c5-7234-baad-000c79bc9a6b	Jacinto de Oliveira	integral	5 ano	2026-08-27 14:30:30	2026-08-27 14:30:30	\N
01a04451-047b-7206-9e8c-872eb8448558	01a04451-046d-725f-a23c-fad397c4b95c	Consuelo	integral	7 ano	2026-08-27 14:42:35	2026-08-27 14:42:35	\N
01a0449d-88f3-7321-89f5-6a5ababe75fc	01a0449d-87ed-7162-994a-1027af7499a0	\N	\N	\N	2026-08-27 16:06:10	2026-08-27 16:06:10	\N
01a0b563-5433-7354-9d86-278f3e46ae59	01a0b563-5427-723a-812a-0f175368a841	\N	\N	\N	2026-09-18 13:39:40	2026-09-18 13:39:40	\N
01a0b55f-d54b-71a0-8c02-a5227bd6f2c0	01a0b55f-d535-7259-9c00-4a8ef2486221	\N	\N	\N	2026-09-18 13:35:51	2026-09-18 13:40:08	2026-09-18 13:40:08
01a0d954-e8ba-70fd-bada-70544121279b	01a0d954-e883-720d-b7ea-3e68db80d027	\N	\N	\N	2026-09-25 13:10:15	2026-09-25 13:10:15	\N
01a0da50-2033-72d6-a95d-6b340b7b0cba	01a0da50-2002-7370-87c4-2a6b32841190	\N	\N	\N	2026-09-25 17:44:39	2026-09-25 17:44:39	\N
01a10dc0-d8bd-72eb-822d-02854967ed99	01a10dc0-d890-73a0-9107-98fd25a324ef	Consuelo	integral	7 ano C	2026-10-05 17:28:24	2026-10-05 17:28:24	\N
01a12207-d59d-71f6-82d9-68c84a3799a7	01a12207-d572-7227-a89e-9f11da7b3920	\N	\N	\N	2026-10-09 15:58:21	2026-10-09 15:58:21	\N
01a13673-e1c1-7234-ae66-af9408f7b67b	01a13673-e182-70e4-b8d5-b9832d4783ca	MERCIA	integral	4 º ANO	2026-10-13 15:08:46	2026-10-13 15:19:26	\N
01a155ae-672b-71b1-93e5-0c0f00623bbd	01a155ae-66e2-718d-bbe7-f70fac829f36	\N	\N	\N	2026-10-19 16:40:55	2026-10-19 16:40:55	\N
\.


--
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participants (id, name, cpf, rg, photo_path, birth_date, phone, address, unit, created_at, updated_at, deleted_at) FROM stdin;
019dd41c-81df-7379-9875-a49fcf0fc152	Teste	\N	\N	participants/photos/uykfim1prsuvWtdVBmC1z1XUd7wr4CwhPtQvbqI5.png	2005-02-13	\N	\N	Espaço Esperança	2026-04-28 09:42:11	2026-05-20 16:51:44	2026-05-20 16:51:44
019f23cf-d26e-72e4-a177-4aa236ea8020	João Miguel Luiz Batista Gomes	60021781800	\N	\N	2014-03-18	18996675596	Antônio Venâncio Lopes 26-05	Espaço Esperança	2026-07-02 14:10:50	2026-07-02 14:10:50	\N
019e46f1-7e7c-73f3-aa6b-d2a4e3e0e952	Abner Samuel dos Santos Andrade	\N	\N	\N	2011-10-19	\N	\N	Espaço Esperança	2026-05-20 16:51:32	2026-06-02 03:48:51	\N
019ea810-5bb0-70a2-9541-35e238601336	Adelaide Barbosa da Silva	18546452857	149761041	\N	1960-10-21	18981188649	José de Oliveira 12-21	Espaço Esperança	2026-06-08 13:28:24	2026-06-08 13:29:19	2026-06-08 13:29:19
019ea817-0c82-71c7-b46f-de652873a09f	Santa Cabral Klebes	27472160806	56428250	\N	1952-11-01	18981054680	Rua Juca Pita 16-54	Espaço Esperança	2026-06-08 13:35:43	2026-06-08 13:35:43	\N
019ea81a-e664-72b3-97df-381f7ae7433f	Janete Lima Leite	25052749830	243117073	\N	1961-06-15	18981430434	Rua Minas Gerais 24-71	Espaço Esperança	2026-06-08 13:39:55	2026-06-08 13:39:55	\N
019ea81c-6801-73a4-8653-f5731c5af8e6	Sebastiana Alves Maciel	03890919871	\N	\N	1961-01-20	1832817174	Rua Guanabara 34-84	Espaço Esperança	2026-06-08 13:41:34	2026-06-08 13:41:34	\N
019ea81f-3f03-7116-8007-175af8fba96c	Lilian Cristina Alves Bezerra	26987673837	302386142	\N	1978-06-28	18996851347	Rua Maceió 3-51	Espaço Esperança	2026-06-08 13:44:40	2026-06-08 13:44:40	\N
019ea821-6dea-7360-8e42-2c077c73ee89	Eliana Rodrigues da Silva	10124437877	199187666	\N	1968-10-22	11972396267	Rua Minas Gerais 4-71	Espaço Esperança	2026-06-08 13:47:03	2026-06-08 13:47:03	\N
019ea823-851a-7118-9f29-6766c8001bf0	Clarinda de Jesus Francisco Soares	05887748800	63776315	\N	1951-05-13	18982047740	Rua João Gourlart 2-79	Espaço Esperança	2026-06-08 13:49:20	2026-06-08 13:49:20	\N
019ea825-ea62-705f-82a8-b7650680c160	Maria Aparecida do Nascimento	10470526874	\N	\N	1963-03-10	18981226696	Rua José de Oliveira 11-72	Espaço Esperança	2026-06-08 13:51:57	2026-06-08 13:51:57	\N
019ea827-daea-703b-ae3b-3973d1efb81e	Lourdes Lopes Câmara	03557416879	\N	\N	1954-06-24	1832818299	Av dos Ipês	Espaço Esperança	2026-06-08 13:54:04	2026-06-08 13:54:04	\N
019ea829-c2ab-715d-ab93-149420822a79	Eliana Campos de Moraes	06960223890	\N	\N	1966-05-25	18981163637	Rua João Rodrigues Louzano 10-74	Espaço Esperança	2026-06-08 13:56:09	2026-06-08 13:56:09	\N
019ea82c-a7c1-7057-9199-136fde3fc57e	Viviane de Araújo Garbim	26855092837	\N	\N	1979-01-11	18997854104	Rua Pernambuco 24-18	Espaço Esperança	2026-06-08 13:59:19	2026-06-08 13:59:19	\N
019ea831-0877-70c3-9cec-fe6aec64fc14	Miriam Alves de Souza	\N	\N	\N	1965-08-13	18981313005	Teotônio Vilela 12-17	Espaço Esperança	2026-06-08 14:04:06	2026-06-08 14:04:06	\N
019ea834-0669-7318-b416-71145e18ced4	Maria Cecilia Alves Souza Rocha	\N	\N	\N	1960-12-16	\N	Estevam Holpert 13-81	Espaço Esperança	2026-06-08 14:07:22	2026-06-08 14:07:22	\N
019ea831-2117-701b-8eb2-ea3fc6e6b3e5	Miriam Alves de Souza	\N	\N	\N	1965-08-13	18981313005	Teotônio Vilela 12-17	Espaço Esperança	2026-06-08 14:04:12	2026-06-08 14:07:40	2026-06-08 14:07:40
019ea836-b0a1-7133-b156-a3beb07cf0c5	Maria Diva do Nascimento	\N	\N	\N	1960-07-02	\N	Manoel de Souza Barbeiro	Espaço Esperança	2026-06-08 14:10:16	2026-06-08 14:10:16	\N
019ea819-1116-71ea-9acb-cbcfe56d5cd2	Maria Angelica do Nascimento	00238221806	212980403	\N	1959-07-07	18988089663	Rua Minas Gerais 26-50	Espaço Esperança	2026-06-08 13:37:55	2026-06-08 14:10:32	\N
019ea838-7cad-726a-9d1b-c61c6bc5de1b	Celi Massoco da Silva	\N	\N	\N	1969-12-06	18997302580	Venceslau Bras 4-44	Espaço Esperança	2026-06-08 14:12:14	2026-06-08 14:12:14	\N
019ea83a-2946-719a-8889-2b401be44dce	Janet Teixeira dos Santos Cavalcante	\N	\N	\N	1963-11-05	18981272097	Teotônio Vilela 12-81	Espaço Esperança	2026-06-08 14:14:04	2026-06-08 14:14:04	\N
019ea83c-cd1e-7115-a782-580ff6e2df46	Claudete Marcelino	\N	\N	\N	1961-04-02	18996957512	José de Oliveira 13-49	Espaço Esperança	2026-06-08 14:16:57	2026-06-08 14:16:57	\N
019ea83f-cf39-714e-aed5-16c0bf443a0d	Celia Regina Hunkel Dassie Silva	92660509891	\N	\N	1956-10-30	18988121326	Guanabara 22-63	Espaço Esperança	2026-06-08 14:20:14	2026-06-08 14:20:14	\N
019ea842-10e2-72c5-bdeb-78f4ef5a8c80	Maria Da Graça Pereira Miranda	20634386840	\N	\N	1948-01-29	\N	Aracaju 15-50	Espaço Esperança	2026-06-08 14:22:42	2026-06-08 14:22:42	\N
019ea844-708b-716e-98e6-435f82f93d85	Amanda Ribeiro Oliveira Maldonado	\N	404314387	\N	1985-04-29	18981986804	Rua Miguel Pedro Miguel 22-80	Espaço Esperança	2026-06-08 14:25:18	2026-06-08 14:25:18	\N
019ea84c-3458-70d4-bedc-aeb19042d3f9	Maria Aparecida Lopes Gaspar	11716846811	\N	\N	1963-02-13	18996429934	Rua Fernando Costa 12-36	Espaço Esperança	2026-06-08 14:33:46	2026-06-08 14:33:46	\N
019ea850-29b1-71d9-8551-ae5b81c9bb6c	Adelaide Barbosa Da Silva	\N	\N	\N	1960-10-21	18981188649	José de Oliveira 12-21	Espaço Esperança	2026-06-08 14:38:06	2026-06-08 14:38:06	\N
019ea861-418d-7150-bbb4-5533b73d7504	Marcia Aparecida Martins	24655240890	\N	\N	1964-09-19	18981705667	Rua Joaquim de Souza Martins 12-79	Espaço Esperança	2026-06-08 14:56:46	2026-06-08 14:56:46	\N
019ea862-9946-724c-948d-3feef389c611	Elizabeth Hunkell Dassie Noronha	04744914802	\N	\N	1960-05-02	18981597306	Rua Guanabara 11-47	Espaço Esperança	2026-06-08 14:58:14	2026-06-08 14:58:38	\N
019ea864-2543-735f-b20b-7b5ef3587806	Marinalva Aparecida Guinossi	07624570823	\N	\N	1964-04-03	11982984901	Rua Aracaju 23-35	Espaço Esperança	2026-06-08 14:59:55	2026-06-08 14:59:55	\N
019ea866-aa14-73b7-8700-129ad6212b27	Luzia Paranhos	13822437824	\N	\N	1964-12-13	18998264953	Rua Maxmino de Lima 15-45	Espaço Esperança	2026-06-08 15:02:41	2026-06-08 15:02:41	\N
019ea868-326a-7070-9bad-eb4e471c674b	Valdeci Corsino de Jesus	\N	\N	\N	1951-08-21	18981060456	Rua Miguel Pedro Miguel 24-77	Espaço Esperança	2026-06-08 15:04:21	2026-06-08 15:04:21	\N
019ea894-9707-71dd-9448-f213e631ac55	denize	\N	\N	\N	1999-04-27	\N	\N	Espaço Esperança	2026-06-08 15:52:50	2026-06-08 15:52:50	\N
019ea896-4a80-70cc-91c3-83405030e7ed	denize babosa	\N	\N	\N	1998-04-23	\N	\N	Espaço Esperança	2026-06-08 15:54:42	2026-06-08 15:54:42	\N
019ea897-8728-70b7-866f-4dfc37f415da	Ana Karla	\N	\N	\N	1999-03-21	\N	\N	Espaço Esperança	2026-06-08 15:56:03	2026-06-08 15:56:16	2026-06-08 15:56:16
019ea898-49fa-7390-ab3c-d28295c971fe	Ana Karla	\N	\N	\N	1999-02-21	\N	\N	Espaço Esperança	2026-06-08 15:56:53	2026-06-08 15:57:09	2026-06-08 15:57:09
019ea898-fd3d-720b-b16a-635355f71597	Denize Bonfim	\N	\N	\N	1888-02-21	\N	\N	Espaço Esperança	2026-06-08 15:57:39	2026-06-08 15:57:50	2026-06-08 15:57:50
019efff0-a100-7079-958e-eff405049f6e	Aparecida Rodrigues Dos Santos	25226406827	23987867	\N	1958-04-14	18981101203	Rua Jose Rodrigues de Lima 24-66	Espaço Esperança	2026-06-25 15:00:20	2026-06-25 15:00:20	\N
019f23d2-0f65-72c1-b310-f08055930c63	Heitor Miguel de Souza Almeida	\N	\N	\N	2016-02-01	18981954723	Teotônio Vilela 12-17	Espaço Esperança	2026-07-02 14:13:16	2026-07-02 14:13:16	\N
019f23d4-b33e-7017-9c6c-1e52905168dc	Analice dos Santos Andrade	58077722881	\N	\N	2014-02-15	18981362885	João Rodrigues Louzano 13-84	Espaço Esperança	2026-07-02 14:16:09	2026-07-02 14:16:09	\N
019f23d6-29ab-73f7-ae5f-6bb340ad0b01	Miguel Nascimento Costa	\N	\N	\N	2012-02-13	18981475489	Waldir Loyolla 4-21	Espaço Esperança	2026-07-02 14:17:45	2026-07-02 14:17:45	\N
019f23d8-78d0-72c9-bbce-9977a6845797	Yan Fellipe Gonçalves Mandu	\N	\N	\N	2012-01-15	18981300350	Miguel Pedro Miguel 22-41	Espaço Esperança	2026-07-02 14:20:17	2026-07-02 14:20:17	\N
019f23da-5b6b-7138-a534-7bd65a738ab9	Pietro Santiago Santana de Oliveira	\N	\N	\N	2010-12-13	18981156233	João Rodrigues Lozano 10-06	Espaço Esperança	2026-07-02 14:22:20	2026-07-02 14:22:20	\N
019f23dc-1445-72de-8c78-c1b27fa4987f	heitor Marques Agostinho da silva	\N	\N	\N	2014-09-26	18981225171	Joaquim de Souza Martins 12-78	Espaço Esperança	2026-07-02 14:24:13	2026-07-02 14:24:13	\N
019f23dd-dccd-7011-82e6-090a2eb2f684	Ytallo Phelipe Souza da Silva	\N	\N	\N	2017-05-06	18981728060	Maximino de Lima	Espaço Esperança	2026-07-02 14:26:10	2026-07-02 14:26:10	\N
019f23df-7a16-71c4-972a-55fa6cd94199	Raphael Garbin	\N	\N	\N	2010-08-14	11978294863	Álvaro Coelho 13-68	Espaço Esperança	2026-07-02 14:27:56	2026-07-02 14:27:56	\N
019f23e1-9a76-73e7-975b-b6f978a9ef40	Luis Miguel Ribeiro de Brito Silva	\N	\N	\N	2015-07-03	18981465048	Neuza Correa A. Carvalho	Espaço Esperança	2026-07-02 14:30:15	2026-07-02 14:30:15	\N
019f23e3-21b9-702d-9b9b-2ad7c4316d7d	Miguel Ferreira de Almeida	\N	\N	\N	2016-03-17	18988006110	Neusa Correia de Assis Carvalho	Espaço Esperança	2026-07-02 14:31:55	2026-07-02 14:31:55	\N
019f23e5-db97-72a5-8029-abfa9f328ed5	Jonathan José da Silva Rocha	\N	\N	\N	2016-02-22	18997355065	\N	Espaço Esperança	2026-07-02 14:34:54	2026-07-02 14:34:54	\N
019f23ed-0ff6-71cf-a6ca-fe8b37735aa2	Davi Constatino dos Santos	\N	\N	\N	2016-01-01	\N	\N	Espaço Esperança	2026-07-02 14:42:46	2026-07-02 14:42:46	\N
019f23ef-12f2-73d4-8239-258c964bd778	Clara Tamara Gomes Roble Valério	\N	\N	\N	2016-05-05	18996799012	\N	Espaço Esperança	2026-07-02 14:44:58	2026-07-02 14:44:58	\N
019f23ef-9aec-703d-b404-c6f70cc7fd60	Clara Tamara Gomes Roble Valério	\N	\N	\N	2016-05-05	18996799012	\N	Espaço Esperança	2026-07-02 14:45:33	2026-07-02 14:45:55	2026-07-02 14:45:55
019f23f2-a3ce-7373-a015-7f7b20e51e2a	Natalia Aparecida Ribeiro Soares	11717515835	\N	\N	1968-12-25	18996498742	Manoel de Souza Barbeiro 10-66	Espaço Esperança	2026-07-02 14:48:52	2026-07-02 14:48:52	\N
019f23f4-b7da-7012-890b-794942d0af42	Samuel Gomes Roble Valério	\N	\N	\N	2018-04-25	18996799012	\N	Espaço Esperança	2026-07-02 14:51:08	2026-07-02 14:51:08	\N
019f23f6-281b-73cd-b1d0-420531076382	Rodrigo da Silva Vieira	\N	\N	\N	2010-05-09	\N	\N	Espaço Esperança	2026-07-02 14:52:42	2026-07-02 14:52:42	\N
019f23fc-69f6-72f2-a0de-0cd9261fd295	Sofia Santos Leandro	48043158886	\N	\N	2010-11-23	18996695572	Álvaro Coelho 20-66	Espaço Esperança	2026-07-02 14:59:32	2026-07-02 14:59:32	\N
019f23fe-aac7-7165-88a1-789edb82ede3	Vitor Henrique Jardim de Souza	\N	\N	\N	2009-12-26	\N	Maura Ap Vergani	Espaço Esperança	2026-07-02 15:02:00	2026-07-02 15:02:00	\N
019f2404-7939-7034-931f-46ad4c880cd9	Théo Lisboa Martins Gonzaga	\N	\N	\N	2019-04-24	\N	\N	Espaço Real	2026-07-02 15:08:20	2026-07-02 15:08:20	\N
019f2406-03ca-731e-b4e7-d959d8162ccb	Conrado Martins Gonzaga	\N	\N	\N	2015-10-30	18996394276	Aracaju 2145	Espaço Real	2026-07-02 15:10:01	2026-07-02 15:10:01	\N
019f2408-7937-7124-9e26-c742ab05af5f	Valentina Rodrigues Ferreira Jurumeira	55583777800	\N	\N	2016-11-14	18997848755	Domingos Lima	Espaço Real	2026-07-02 15:12:42	2026-07-02 15:12:42	\N
019f240a-74af-73dd-857a-149822fe001b	Artur Lopes de oliveira Macedo	51883182883	\N	\N	2016-06-15	18996519424	Sitio Nossa Senhora Aarecida- Assentamento Engenho 2 lote 3	Espaço Real	2026-07-02 15:14:52	2026-07-02 15:14:52	\N
019f240d-c80e-72b7-b56f-ef5b303a29aa	Bhanjamyn Lucas Barbosa Barreto	51510474854	\N	\N	2015-09-03	18997069884	Silvio Talavera 2327	Espaço Real	2026-07-02 15:18:30	2026-07-02 15:18:30	\N
019f240e-f987-7154-9fd2-ee9f250e384b	Heitor Soares dos Santos	\N	\N	\N	2017-06-13	\N	\N	Espaço Real	2026-07-02 15:19:48	2026-07-02 15:19:48	\N
019f241c-e4e8-713d-9331-4cb794c1a10c	Kayo Lucas dos Santos	\N	\N	\N	2015-04-15	18998198282	\N	Espaço Esperança	2026-07-02 15:35:01	2026-07-02 15:35:01	\N
019f241f-9dcf-703f-a8cc-82faa1c4a5a7	Davi Navarro de Souza Ruiz	49919388807	\N	\N	2015-06-12	18981275115	Manoel de Souza Barbeiro	Espaço Real	2026-07-02 15:37:59	2026-07-02 15:37:59	\N
019f2421-7c56-7289-8831-099c868282db	Luiz Henrique Justino Xavier	60033635846	\N	\N	2014-12-01	\N	\N	Espaço Real	2026-07-02 15:40:02	2026-07-02 15:40:02	\N
019f2423-afe8-7058-a7dd-f11789ebd598	Sophia Barbosa Barreto	52496056800	\N	\N	2017-02-20	18997069884	Silvio Talavera 23-27	Espaço Real	2026-07-02 15:42:26	2026-07-02 15:42:26	\N
019f2425-4a62-71b3-9f4d-fd22768cfc12	Arthur Rodrigues Inacio	56002553819	\N	\N	2013-03-03	\N	\N	Espaço Real	2026-07-02 15:44:11	2026-07-02 15:44:11	\N
019f2426-976a-73bc-8feb-fb033192f832	Adryan henrique de Oliveira Andrade	\N	\N	\N	2015-04-09	18981790467	Belém 23-59	Espaço Real	2026-07-02 15:45:36	2026-07-02 15:45:36	\N
019f2427-8730-713b-aa9b-320ce0d3342e	Sofia Oliveira Rocha	52844148883	\N	\N	2017-04-23	\N	\N	Espaço Real	2026-07-02 15:46:38	2026-07-02 15:46:38	\N
019f2428-cf58-72cb-9d4d-5d4b255c329f	Benjamin Rodrigues Inácio	\N	\N	\N	2014-04-28	\N	\N	Espaço Real	2026-07-02 15:48:02	2026-07-02 15:48:02	\N
019f2429-89ad-716b-b1ec-3fbdb7f96ba2	Maria Lavinia R. Gomes	\N	\N	\N	2017-05-09	\N	\N	Espaço Real	2026-07-02 15:48:49	2026-07-02 15:48:49	\N
019f242a-f86f-70ff-9c6e-c80dc9a3ef76	Isabelly Vitorio de Oliveira Andrade	\N	\N	\N	2016-05-21	18981790467	Belém 23-59	Espaço Real	2026-07-02 15:50:23	2026-07-02 15:50:23	\N
019f242d-9652-70eb-b7f5-9d6ed25bdce3	Heitor Hideki Rocha Sakakibara	\N	\N	\N	2014-09-11	18998234609	Belém 33-50	Espaço Real	2026-07-02 15:53:15	2026-07-02 15:53:15	\N
019f242f-282a-7079-a7d7-a80727513a91	Dominike Marque da Silva	\N	\N	\N	2013-12-10	11972943018	Minas Gerais	Espaço Esperança	2026-07-02 15:54:58	2026-07-02 15:54:58	\N
019f2430-b0a5-7168-99e2-09976a758ec7	Matheus Henrique de Oliveira Maia	\N	\N	\N	2013-04-18	48991477671	Natal 01-37	Espaço Esperança	2026-07-02 15:56:38	2026-07-02 15:56:38	\N
019f2433-82e1-72dd-b6b4-8bc045fd7576	Luiz Gustavo de Oliveira Sales	\N	\N	\N	2013-07-07	18996860316	Venceslau Bras 22-61	Espaço Esperança	2026-07-02 15:59:43	2026-07-02 15:59:43	\N
019f2434-6f67-7332-8c69-ace3defb4a53	Davi da Silva Ramos	\N	\N	\N	2013-10-30	18981764793	José Rodrigues de Lima	Espaço Esperança	2026-07-02 16:00:44	2026-07-02 16:00:44	\N
019f2435-80b5-70be-ab51-c221666b406e	Guilherme Andrelino Evans	\N	\N	\N	2009-05-17	18996144872	Francisco Tolentino da Silva	Espaço Esperança	2026-07-02 16:01:53	2026-07-02 16:01:53	\N
019f2436-fefc-7357-950c-f69baadedaef	Gabriel da Silva Florêncio Araújo	\N	\N	\N	2011-09-15	18935000988	Venceslau Brás 18-37	Espaço Esperança	2026-07-02 16:03:31	2026-07-02 16:03:31	\N
019f2438-0e60-7065-958b-8abb179113aa	Pietro Domingos Bertoldi	\N	\N	\N	2012-09-24	18981186652	Neusa Correia de Assis Carvalho	Espaço Esperança	2026-07-02 16:04:41	2026-07-02 16:04:41	\N
019f2439-2956-72a4-9af9-146653403346	Isac  Emanuel Pereira Tenório	\N	\N	\N	2012-03-09	18996999938	Neuza Correia	Espaço Esperança	2026-07-02 16:05:53	2026-07-02 16:05:53	\N
019f243a-58b2-733b-b14a-c57263f12319	Lucas Gabriel Bueno Alves	\N	\N	\N	2011-08-08	\N	José Rodrigues de Lima 30-06	Espaço Esperança	2026-07-02 16:07:11	2026-07-02 16:07:11	\N
019f243c-5459-7395-85e8-00bdb60348d5	Pedro Henrique dos Santos de Santana	\N	\N	\N	2010-08-13	18997250525	E3midio de Lima Paes	Espaço Esperança	2026-07-02 16:09:21	2026-07-02 16:09:21	\N
019f243e-7cf8-729a-8105-6fc7c7eeb656	Vitória Hadassa Saad Amorim	\N	\N	\N	2015-08-22	18997651040	Antônio Venâncio Lopes 32-69	Espaço Esperança	2026-07-02 16:11:42	2026-07-02 16:11:42	\N
019f243f-b46d-737f-b478-99d82ec8f5c0	Isaac Saad Amorim	\N	\N	\N	2015-08-22	18997651040	Antônio Venâncio Lopes 32-69	Espaço Esperança	2026-07-02 16:13:02	2026-07-02 16:13:02	\N
019f243b-6e89-71a8-aeb0-a23061a21981	Deivid Senturião Frota dos Santos	\N	\N	\N	2013-02-09	18981790612	Alziro Baltazar 5-50	Espaço Real	2026-07-02 16:08:22	2026-07-02 16:19:07	\N
019f246e-b89c-7370-9d32-c18d1f44ed20	Hugo Javier Delvalle Gonzalez	\N	\N	\N	2017-06-05	\N	Miguel Pedro Miguel 30-77	Espaço Esperança	2026-07-02 17:04:23	2026-07-02 17:04:23	\N
019f2467-9b5c-7175-a77e-a718ede6b1a7	Hugo Javier Delvalle Gonzales	90085776823	\N	\N	2017-06-05	18997241149	Miguel Pedro Miguel 30-77	Espaço Esperança	2026-07-02 16:56:37	2026-07-02 17:06:43	2026-07-02 17:06:43
019f248e-baa6-7148-9db4-d3d468da4a95	Isabela Goes Felix	\N	\N	\N	2015-11-25	18991077865	\N	Espaço Esperança	2026-07-02 17:39:21	2026-07-02 17:39:21	\N
019f2495-d8be-7284-a9d4-1e72bda0ca2d	Samuel Leonardo Almeida de Souza	\N	\N	\N	2015-09-01	\N	Faustino Dias 13-37	Espaço Esperança	2026-07-02 17:47:07	2026-07-02 17:47:07	\N
019f298b-dd42-72da-a454-ba7943289e0c	Heitor Gomes Bezerra	51029624852	\N	\N	2016-03-16	18981308898	Gerônimo Ribeiro 30-82 Jd. Real	Espaço Real	2026-07-03 16:54:19	2026-07-03 16:57:55	\N
019f3882-5836-702a-8f3a-e31bfe5a8392	Ivana de Almeida Flores	15889465848	\N	\N	1953-04-24	18997746296	Fernando Costa 22-74	Espaço Esperança	2026-07-06 14:38:14	2026-07-06 14:38:14	\N
019fc8b1-9e40-7258-bc42-6c5502e495b7	Zilda Maciel do Carmo	12087877807	\N	\N	1950-10-25	18981260586	Guanabara 34-84	Espaço Esperança	2026-08-03 14:35:11	2026-08-03 14:35:11	\N
019fdd22-e121-7093-8603-1c5da640d3b9	Enzzo Gabriel Secchi da Silva	60033485852	\N	\N	2013-12-29	18981083131	miguel Melado 13-41	Espaço Esperança	2026-08-07 13:51:18	2026-08-07 13:52:12	\N
01a0166a-0339-700d-9eb9-519b80b05c1b	Laura Beatriz Melo Gomes	57880157824	\N	\N	2013-09-20	11952369292	Mario Bittencourt 21-119	Espaço Esperança	2026-08-18 16:47:21	2026-08-18 16:47:21	\N
01a034bb-d2df-70fc-ba01-d309f32df657	Sirley Maria Paiva	09749079876	\N	\N	1959-08-01	18981080381	Armando Puerta 13-49	Espaço Esperança	2026-08-24 14:05:19	2026-08-24 14:05:19	\N
01a0443f-8330-7233-ad2d-ade67d6262d5	Millena Luiza Fagundes Suares	09238503176	\N	\N	2018-04-11	18981415986	Rua Geronimo Ribeiro 32-30	Espaço Real	2026-08-27 14:23:28	2026-08-27 14:23:28	\N
01a04445-f3c5-7234-baad-000c79bc9a6b	Luana Beatriz Fagundes Loveira	10030851130	\N	\N	2015-03-21	\N	Rua joao pessoa 2586	Espaço Real	2026-08-27 14:30:30	2026-08-27 14:30:30	\N
01a04451-046d-725f-a23c-fad397c4b95c	Pedro Miguel Fagundes Loveira	08230284105	\N	\N	2014-01-01	\N	Rua Joao Pessoa 2586	Espaço Real	2026-08-27 14:42:35	2026-08-27 14:42:35	\N
01a0449d-87ed-7162-994a-1027af7499a0	Eva Ramos da Cruz	26170383860	\N	\N	1951-06-28	18997825238	Rodolfo Rodrigues de Abreu 21-64	Espaço Esperança	2026-08-27 16:06:09	2026-08-27 16:06:09	\N
01a0b563-5427-723a-812a-0f175368a841	Kauã Hideki Rocha Shimabukuro	50656650877	\N	\N	2015-04-23	18997783038	Gonsalo Miranda 9-55 Jd Real 2	Espaço Real	2026-09-18 13:39:40	2026-09-18 13:40:29	\N
01a0b55f-d535-7259-9c00-4a8ef2486221	Kauã Hideki Rocha Shimabukuro	50656650877	\N	\N	2015-04-23	18997783038	Gonsalo Miranda 9-55 Jd Real 2	Espaço Real	2026-09-18 13:35:51	2026-09-18 13:40:08	2026-09-18 13:40:08
01a0d954-e883-720d-b7ea-3e68db80d027	Isabelli Oliveira Mathias	50522232850	\N	\N	2015-10-01	18935012498	São Luiz 31-83 Jd Real 1	Espaço Real	2026-09-25 13:10:15	2026-09-25 13:10:15	\N
01a0da50-2002-7370-87c4-2a6b32841190	Kauan Gabriel Oliveira dos Santos	58840634827	\N	\N	2013-11-01	18996393293	Rua José Narezi 1-20	Espaço Esperança	2026-09-25 17:44:39	2026-09-25 17:44:39	\N
01a10dc0-d890-73a0-9107-98fd25a324ef	Haniel Gomides Viana	53103040881	\N	\N	2014-01-31	18997816375	Rua Paraná 12-50	Espaço Esperança	2026-10-05 17:28:24	2026-10-05 17:28:24	\N
01a12207-d572-7227-a89e-9f11da7b3920	Jean Victor Angeloni Ozéias	50406274835	\N	\N	2012-12-10	18981287346	Professor Benicio Xavier 41-09	Espaço Esperança	2026-10-09 15:58:21	2026-10-09 15:58:21	\N
01a13673-e182-70e4-b8d5-b9832d4783ca	GUILHERME ALVES DOS SANTOS	56465938839	\N	\N	2019-01-24	18981031072	ALZIRO BALTAZAR Nº 11-10	Espaço Real	2026-10-13 15:08:46	2026-10-13 15:08:46	\N
01a155ae-66e2-718d-bbe7-f70fac829f36	Eric Vinicius Dornelas Santana Lima	00625581881	\N	\N	2014-10-21	11971584191	rua Belo Horizonte 4-22	Espaço Esperança	2026-10-19 16:40:55	2026-10-19 16:40:55	\N
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, role, email_verified_at, password, remember_token, created_at, updated_at, deleted_at) FROM stdin;
019dd037-5efb-7350-80d1-e05e9ff6a8fb	Administrador	admin@institutodaltonsalomao.org.br	administrador	2026-04-27 15:33:02	$2y$12$Er3/Fbsm5YwCEr3pS3uZ3OmMR2BLpUq6Tc5l9n/rxc/ow5i5V7emq	\N	2026-04-27 15:33:02	2026-04-28 23:58:43	\N
019e46f6-45c7-70df-96fb-c790c4e0325c	Denize Bonfim	dehbarbosa34@gmail.com	professor	2026-05-20 16:56:45	$2y$12$F8URn1btdaILlH5bqyxA0e0swEN/gSvA599JX0MvNtdjsak2pAGKO	\N	2026-05-20 16:56:45	2026-05-20 16:56:45	\N
019f23c2-64a9-7205-8667-a9e2a54077b5	César Merigio	cesinham99@hotmail.com	professor	2026-07-02 13:56:10	$2y$12$81WJ2DuvXKl1sQfig5VcIemfCfJI0vKqGyXfe0d.JhPNfZ91zt.dG	\N	2026-07-02 13:56:10	2026-07-02 13:56:10	\N
019f23c3-d572-7085-8a97-53590d6b4f19	Danilo Menezes	danilomenezeslima08@gmail.com	professor	2026-07-02 13:57:44	$2y$12$/oD0.B9WcDpPF8GH713KB.5GFYekxtSQ/va4.Egf8UKgATkrIu0qm	\N	2026-07-02 13:57:44	2026-07-02 13:57:44	\N
019f2403-2e62-7358-aa5b-0645d51d819f	Vitor	vitor_bjj@live.com	professor	2026-07-02 15:06:56	$2y$12$UAvyKFPG6nMU7mxxg7MVZu7SoyrgBgupmGj0qK6b/3imU5FymjEPu	\N	2026-07-02 15:06:56	2026-07-02 15:06:56	\N
019f23ba-3287-73e8-bbc9-ecb0fb1f941b	Mara	mguinossi@gmail.com	professor	2026-07-02 13:47:13	$2y$12$JhHkwiVz6Uz0vsdijjEL6OsWFi8CGYDEFYVG95Q6TuEMwoua0MO.u	\N	2026-07-02 13:47:13	2026-08-03 18:18:14	\N
01a1315b-f65c-7194-88a1-4bcba65ed33d	Romulo	romulovitorifsp@gmail.com	administrador	2026-10-12 15:24:32	$2y$12$ByVJvwiXBRJi0WlOUhY8teLnt5mdbn/QSK/3BJlN1PvEGMdGOM8oi	\N	2026-10-12 15:24:32	2026-10-12 15:24:32	\N
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 24, true);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: activity_participant activity_participant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_participant
    ADD CONSTRAINT activity_participant_pkey PRIMARY KEY (activity_id, participant_id);


--
-- Name: attendances attendances_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_pkey PRIMARY KEY (id);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: participant_authorizations participant_authorizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_authorizations
    ADD CONSTRAINT participant_authorizations_pkey PRIMARY KEY (id);


--
-- Name: participant_family_members participant_family_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_family_members
    ADD CONSTRAINT participant_family_members_pkey PRIMARY KEY (id);


--
-- Name: participant_filiations participant_filiations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_filiations
    ADD CONSTRAINT participant_filiations_pkey PRIMARY KEY (id);


--
-- Name: participant_guardians participant_guardians_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_guardians
    ADD CONSTRAINT participant_guardians_pkey PRIMARY KEY (id);


--
-- Name: participant_health participant_health_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_health
    ADD CONSTRAINT participant_health_pkey PRIMARY KEY (id);


--
-- Name: participant_housings participant_housings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_housings
    ADD CONSTRAINT participant_housings_pkey PRIMARY KEY (id);


--
-- Name: participant_observations participant_observations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_observations
    ADD CONSTRAINT participant_observations_pkey PRIMARY KEY (id);


--
-- Name: participant_schools participant_schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_schools
    ADD CONSTRAINT participant_schools_pkey PRIMARY KEY (id);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: activities_description_unaccent_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activities_description_unaccent_trgm_idx ON public.activities USING gin (public.f_unaccent(description) public.gin_trgm_ops);


--
-- Name: activities_name_unaccent_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activities_name_unaccent_trgm_idx ON public.activities USING gin (public.f_unaccent((name)::text) public.gin_trgm_ops);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: documents_title_unaccent_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX documents_title_unaccent_trgm_idx ON public.documents USING gin (public.f_unaccent((title)::text) public.gin_trgm_ops);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: participants_cpf_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX participants_cpf_unique ON public.participants USING btree (cpf) WHERE (deleted_at IS NULL);


--
-- Name: participants_name_unaccent_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX participants_name_unaccent_trgm_idx ON public.participants USING gin (public.f_unaccent((name)::text) public.gin_trgm_ops);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: users_name_unaccent_trgm_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_name_unaccent_trgm_idx ON public.users USING gin (public.f_unaccent((name)::text) public.gin_trgm_ops);


--
-- Name: activities activities_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: activity_participant activity_participant_activity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_participant
    ADD CONSTRAINT activity_participant_activity_id_foreign FOREIGN KEY (activity_id) REFERENCES public.activities(id) ON DELETE CASCADE;


--
-- Name: activity_participant activity_participant_participant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_participant
    ADD CONSTRAINT activity_participant_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: attendances attendances_activity_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_activity_id_foreign FOREIGN KEY (activity_id) REFERENCES public.activities(id) ON DELETE CASCADE;


--
-- Name: attendances attendances_participant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendances
    ADD CONSTRAINT attendances_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: documents documents_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: participant_authorizations participant_authorizations_participant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_authorizations
    ADD CONSTRAINT participant_authorizations_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: participant_family_members participant_family_members_participant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_family_members
    ADD CONSTRAINT participant_family_members_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: participant_filiations participant_filiations_participant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_filiations
    ADD CONSTRAINT participant_filiations_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: participant_guardians participant_guardians_participant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_guardians
    ADD CONSTRAINT participant_guardians_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: participant_health participant_health_participant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_health
    ADD CONSTRAINT participant_health_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: participant_housings participant_housings_participant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_housings
    ADD CONSTRAINT participant_housings_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: participant_observations participant_observations_participant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_observations
    ADD CONSTRAINT participant_observations_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- Name: participant_schools participant_schools_participant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participant_schools
    ADD CONSTRAINT participant_schools_participant_id_foreign FOREIGN KEY (participant_id) REFERENCES public.participants(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict eeChpWiQsbAjawduLyXjGTn9UfxQxITcPlFDpFg2XC9NahqjQypOmFzdUndJaF4

