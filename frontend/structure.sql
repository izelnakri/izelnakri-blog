--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.5
-- Dumped by pg_dump version 9.5.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: balance_sheets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE balance_sheets (
    id integer NOT NULL,
    date date,
    assets bigint NOT NULL,
    liabilities bigint NOT NULL,
    equity bigint NOT NULL,
    current_assets bigint,
    current_liabilities bigint,
    long_term_liabilities bigint,
    fixed_assets bigint,
    intangible_assets bigint,
    goodwill bigint,
    minority_interest bigint,
    audit_stage integer DEFAULT 0,
    report_term_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE balance_sheets OWNER TO postgres;

--
-- Name: balance_sheets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE balance_sheets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE balance_sheets_id_seq OWNER TO postgres;

--
-- Name: balance_sheets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE balance_sheets_id_seq OWNED BY balance_sheets.id;


--
-- Name: cash_flow_statements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE cash_flow_statements (
    id integer NOT NULL,
    start_date date,
    end_date date,
    operating_activities bigint,
    investing_activities bigint,
    financing_activities bigint,
    beginning_cash bigint NOT NULL,
    change_in_cash bigint,
    ending_cash bigint NOT NULL,
    exchange_rate_effects bigint,
    operational_dividends_paid bigint,
    financial_dividends_paid bigint,
    controlling_dividends_paid bigint,
    non_controlling_dividends_paid bigint,
    change_in_paid_in_capital bigint,
    sale_of_shares bigint,
    repurchase_of_shares bigint,
    audit_stage integer DEFAULT 0,
    report_term_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE cash_flow_statements OWNER TO postgres;

--
-- Name: cash_flow_statements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE cash_flow_statements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE cash_flow_statements_id_seq OWNER TO postgres;

--
-- Name: cash_flow_statements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE cash_flow_statements_id_seq OWNED BY cash_flow_statements.id;


--
-- Name: common_stocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE common_stocks (
    id integer NOT NULL,
    outstanding_shares bigint,
    public_float integer,
    payout_ratio integer,
    dividend_yield integer,
    security_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE common_stocks OWNER TO postgres;

--
-- Name: common_stocks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE common_stocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE common_stocks_id_seq OWNER TO postgres;

--
-- Name: common_stocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE common_stocks_id_seq OWNED BY common_stocks.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE companies (
    id integer NOT NULL,
    sourced_name character varying(255) NOT NULL,
    legal_name character varying(255),
    local_name character varying(255),
    name character varying(255),
    is_active boolean,
    is_public boolean DEFAULT true,
    description text,
    website character varying(255),
    city character varying(255),
    address text,
    email character varying(255),
    phone character varying(255),
    facebook_id character varying(255),
    twitter_id character varying(255),
    founded_in character varying(255),
    reporting_type character varying(255),
    outstanding_shares bigint,
    share_capital bigint,
    authorized_share_capital bigint,
    audit_stage bigint DEFAULT 0,
    industry_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE companies OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE companies_id_seq OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE companies_id_seq OWNED BY companies.id;


--
-- Name: currencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE currencies (
    id integer NOT NULL,
    code character varying(255) NOT NULL,
    symbol character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    last_price numeric,
    last_price_updated_at timestamp without time zone,
    previous_close_price numeric,
    previous_close_time timestamp without time zone,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE currencies OWNER TO postgres;

--
-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE currencies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE currencies_id_seq OWNER TO postgres;

--
-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE currencies_id_seq OWNED BY currencies.id;


--
-- Name: directors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE directors (
    id integer NOT NULL,
    role character varying(255),
    since date,
    elected_on date,
    representation character varying(255),
    audit_stage integer DEFAULT 0,
    is_fresh boolean,
    company_id integer NOT NULL,
    person_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE directors OWNER TO postgres;

--
-- Name: directors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE directors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE directors_id_seq OWNER TO postgres;

--
-- Name: directors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE directors_id_seq OWNED BY directors.id;


--
-- Name: dividends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE dividends (
    id integer NOT NULL,
    per_share numeric NOT NULL,
    payment_form character varying(255),
    ex_dividend_date date,
    amount bigint,
    record_date date,
    payment_date date,
    is_ordinary boolean,
    frequency integer,
    sourced_declared_at timestamp without time zone,
    company_id integer NOT NULL,
    security_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE dividends OWNER TO postgres;

--
-- Name: dividends_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE dividends_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dividends_id_seq OWNER TO postgres;

--
-- Name: dividends_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE dividends_id_seq OWNED BY dividends.id;


--
-- Name: emails; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE emails (
    id integer NOT NULL,
    address character varying(255) NOT NULL,
    user_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE emails OWNER TO postgres;

--
-- Name: emails_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE emails_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE emails_id_seq OWNER TO postgres;

--
-- Name: emails_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE emails_id_seq OWNED BY emails.id;


--
-- Name: exchanges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE exchanges (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    short_hand character varying(255) NOT NULL,
    country character varying(255),
    website character varying(255) NOT NULL,
    currency_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE exchanges OWNER TO postgres;

--
-- Name: exchanges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE exchanges_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE exchanges_id_seq OWNER TO postgres;

--
-- Name: exchanges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE exchanges_id_seq OWNED BY exchanges.id;


--
-- Name: historical_prices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE historical_prices (
    id integer NOT NULL,
    price numeric NOT NULL,
    date date NOT NULL,
    security_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE historical_prices OWNER TO postgres;

--
-- Name: historical_prices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE historical_prices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE historical_prices_id_seq OWNER TO postgres;

--
-- Name: historical_prices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE historical_prices_id_seq OWNED BY historical_prices.id;


--
-- Name: income_statements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE income_statements (
    id integer NOT NULL,
    start_date date,
    end_date date,
    sales_revenue bigint,
    other_revenue bigint,
    cost_of_sales bigint,
    other_cost_of_sales bigint,
    total_revenue bigint,
    total_cost_of_sales bigint,
    gross_profit bigint,
    general_and_administrative bigint,
    marketing_and_distribution bigint,
    research_and_development bigint,
    operating_profit bigint,
    interest_income bigint,
    interest_expense bigint,
    profit_before_tax bigint,
    current_tax bigint,
    deferred_tax bigint,
    total_tax bigint,
    continuing_operations bigint,
    discontinued_operations bigint,
    discontinued_operations_after_tax bigint,
    net_profit bigint,
    minority_interest bigint,
    net_profit_attributable_to_shareholders bigint,
    continuing_operations_eps numeric,
    continuing_operations_diluted_eps numeric,
    eps numeric,
    diluted_eps numeric,
    audit_stage integer DEFAULT 0,
    report_term_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE income_statements OWNER TO postgres;

--
-- Name: income_statements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE income_statements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE income_statements_id_seq OWNER TO postgres;

--
-- Name: income_statements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE income_statements_id_seq OWNED BY income_statements.id;


--
-- Name: industries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE industries (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    subindustry character varying(255),
    sector character varying(255) NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE industries OWNER TO postgres;

--
-- Name: industries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE industries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE industries_id_seq OWNER TO postgres;

--
-- Name: industries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE industries_id_seq OWNED BY industries.id;


--
-- Name: managers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE managers (
    id integer NOT NULL,
    title character varying(255),
    since date,
    position_rank integer,
    audit_stage integer DEFAULT 0,
    is_fresh boolean,
    company_id integer NOT NULL,
    person_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE managers OWNER TO postgres;

--
-- Name: managers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE managers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE managers_id_seq OWNER TO postgres;

--
-- Name: managers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE managers_id_seq OWNED BY managers.id;


--
-- Name: notification_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE notification_subscriptions (
    id integer NOT NULL,
    company_id integer NOT NULL,
    user_id integer,
    email_id integer,
    phone_number_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT subscriber_must_exist CHECK ((((user_id IS NOT NULL) OR (email_id IS NOT NULL)) OR (phone_number_id IS NOT NULL)))
);


ALTER TABLE notification_subscriptions OWNER TO postgres;

--
-- Name: notification_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE notification_subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE notification_subscriptions_id_seq OWNER TO postgres;

--
-- Name: notification_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE notification_subscriptions_id_seq OWNED BY notification_subscriptions.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE notifications (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    disclosed_at timestamp without time zone,
    published_at timestamp without time zone,
    company_id integer NOT NULL,
    report_term_id integer,
    director_id integer,
    manager_id integer,
    stock_split_id integer,
    transaction_id integer,
    dividend_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT notification_reference_must_exist CHECK (((((((report_term_id IS NOT NULL) OR (director_id IS NOT NULL)) OR (manager_id IS NOT NULL)) OR (stock_split_id IS NOT NULL)) OR (transaction_id IS NOT NULL)) OR (dividend_id IS NOT NULL)))
);


ALTER TABLE notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE notifications_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE notifications_id_seq OWNED BY notifications.id;


--
-- Name: people; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE people (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    linkname character varying(255) NOT NULL,
    email character varying(255),
    phone character varying(255),
    gender boolean,
    birthdate date,
    twitter_id character varying(255),
    facebook_id character varying(255),
    linkedin_id character varying(255),
    audit_stage integer DEFAULT 0,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE people OWNER TO postgres;

--
-- Name: people_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE people_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE people_id_seq OWNER TO postgres;

--
-- Name: people_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE people_id_seq OWNED BY people.id;


--
-- Name: phone_numbers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE phone_numbers (
    id integer NOT NULL,
    number character varying(255) NOT NULL,
    is_verified boolean,
    user_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE phone_numbers OWNER TO postgres;

--
-- Name: phone_numbers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE phone_numbers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE phone_numbers_id_seq OWNER TO postgres;

--
-- Name: phone_numbers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE phone_numbers_id_seq OWNED BY phone_numbers.id;


--
-- Name: report_terms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE report_terms (
    id integer NOT NULL,
    term integer NOT NULL,
    year integer NOT NULL,
    auditor character varying(255),
    currency character varying(255) NOT NULL,
    consolidated boolean,
    sourced_declared_at timestamp without time zone,
    company_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE report_terms OWNER TO postgres;

--
-- Name: report_terms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE report_terms_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE report_terms_id_seq OWNER TO postgres;

--
-- Name: report_terms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE report_terms_id_seq OWNED BY report_terms.id;


--
-- Name: reports; Type: TABLE; Schema: public; Owner: izelnakri
--

CREATE TABLE reports (
    id integer NOT NULL,
    term integer NOT NULL,
    year integer NOT NULL,
    auditor character varying(255),
    currency character varying(255),
    consolidated boolean,
    audit_stage integer DEFAULT 0,
    reported_at timestamp without time zone,
    company_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE reports OWNER TO izelnakri;

--
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: izelnakri
--

CREATE SEQUENCE reports_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE reports_id_seq OWNER TO izelnakri;

--
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: izelnakri
--

ALTER SEQUENCE reports_id_seq OWNED BY reports.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp without time zone
);


ALTER TABLE schema_migrations OWNER TO postgres;

--
-- Name: securities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE securities (
    id integer NOT NULL,
    ticker character varying(255) NOT NULL,
    last_price numeric,
    last_price_updated_at timestamp without time zone,
    previous_close_price numeric,
    previous_close_time timestamp without time zone,
    isin character varying(255),
    first_issue date,
    exchange_id integer NOT NULL,
    company_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE securities OWNER TO postgres;

--
-- Name: securities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE securities_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE securities_id_seq OWNER TO postgres;

--
-- Name: securities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE securities_id_seq OWNED BY securities.id;


--
-- Name: shareholders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE shareholders (
    id integer NOT NULL,
    voting_interest integer,
    share_count bigint,
    share_stake numeric,
    sourced_name character varying(255),
    audit_stage integer DEFAULT 0,
    is_fresh boolean,
    company_id integer NOT NULL,
    shareholder_person_id integer,
    shareholder_company_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE shareholders OWNER TO postgres;

--
-- Name: shareholders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE shareholders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE shareholders_id_seq OWNER TO postgres;

--
-- Name: shareholders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE shareholders_id_seq OWNED BY shareholders.id;


--
-- Name: stock_splits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE stock_splits (
    id integer NOT NULL,
    ratio character varying(255),
    reverse boolean,
    security_id integer NOT NULL,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE stock_splits OWNER TO postgres;

--
-- Name: stock_splits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE stock_splits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE stock_splits_id_seq OWNER TO postgres;

--
-- Name: stock_splits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE stock_splits_id_seq OWNED BY stock_splits.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE transactions (
    id integer NOT NULL,
    price numeric NOT NULL,
    total_security_amount bigint NOT NULL,
    absolute_stake numeric,
    absolute_amount bigint,
    kind character varying(255),
    date timestamp without time zone NOT NULL,
    security_id integer NOT NULL,
    seller_company_id integer,
    seller_person_id integer,
    buyer_company_id integer,
    buyer_person_id integer,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT amount_or_stake_must_exist CHECK (((absolute_amount IS NOT NULL) OR (absolute_stake IS NOT NULL))),
    CONSTRAINT one_buyer_or_seller_must_exist CHECK (((((seller_company_id IS NOT NULL) OR (seller_person_id IS NOT NULL)) OR (buyer_company_id IS NOT NULL)) OR (buyer_person_id IS NOT NULL)))
);


ALTER TABLE transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE transactions_id_seq OWNED BY transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id integer NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    username character varying(255),
    password_digest character varying(255),
    password_reset_token character varying(255),
    is_confirmed boolean,
    authentication_token character varying(255) NOT NULL,
    fb_access_token character varying(255),
    fb_token_expires_at timestamp without time zone,
    fb_id bigint,
    fb_name character varying(255),
    fb_locale character varying(255),
    fb_gender character varying(255),
    fb_profile_photo character varying(255),
    last_login_at timestamp without time zone NOT NULL,
    last_login_user_agent character varying(255) NOT NULL,
    last_login_ip character varying(255) NOT NULL,
    last_login_type character varying(255) NOT NULL,
    used_android_app boolean,
    used_ios_app boolean,
    is_admin boolean,
    inserted_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: versions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE versions (
    id integer NOT NULL,
    event character varying(255) NOT NULL,
    item_type character varying(255) NOT NULL,
    item_id integer NOT NULL,
    item_changes jsonb,
    meta jsonb,
    inserted_at timestamp without time zone NOT NULL
);


ALTER TABLE versions OWNER TO postgres;

--
-- Name: versions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE versions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE versions_id_seq OWNER TO postgres;

--
-- Name: versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE versions_id_seq OWNED BY versions.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY balance_sheets ALTER COLUMN id SET DEFAULT nextval('balance_sheets_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY cash_flow_statements ALTER COLUMN id SET DEFAULT nextval('cash_flow_statements_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY common_stocks ALTER COLUMN id SET DEFAULT nextval('common_stocks_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY companies ALTER COLUMN id SET DEFAULT nextval('companies_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY currencies ALTER COLUMN id SET DEFAULT nextval('currencies_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY directors ALTER COLUMN id SET DEFAULT nextval('directors_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dividends ALTER COLUMN id SET DEFAULT nextval('dividends_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY emails ALTER COLUMN id SET DEFAULT nextval('emails_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY exchanges ALTER COLUMN id SET DEFAULT nextval('exchanges_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY historical_prices ALTER COLUMN id SET DEFAULT nextval('historical_prices_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY income_statements ALTER COLUMN id SET DEFAULT nextval('income_statements_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY industries ALTER COLUMN id SET DEFAULT nextval('industries_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY managers ALTER COLUMN id SET DEFAULT nextval('managers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notification_subscriptions ALTER COLUMN id SET DEFAULT nextval('notification_subscriptions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notifications ALTER COLUMN id SET DEFAULT nextval('notifications_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY people ALTER COLUMN id SET DEFAULT nextval('people_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phone_numbers ALTER COLUMN id SET DEFAULT nextval('phone_numbers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY report_terms ALTER COLUMN id SET DEFAULT nextval('report_terms_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: izelnakri
--

ALTER TABLE ONLY reports ALTER COLUMN id SET DEFAULT nextval('reports_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY securities ALTER COLUMN id SET DEFAULT nextval('securities_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY shareholders ALTER COLUMN id SET DEFAULT nextval('shareholders_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock_splits ALTER COLUMN id SET DEFAULT nextval('stock_splits_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions ALTER COLUMN id SET DEFAULT nextval('transactions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY versions ALTER COLUMN id SET DEFAULT nextval('versions_id_seq'::regclass);


--
-- Name: balance_sheets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY balance_sheets
    ADD CONSTRAINT balance_sheets_pkey PRIMARY KEY (id);


--
-- Name: cash_flow_statements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY cash_flow_statements
    ADD CONSTRAINT cash_flow_statements_pkey PRIMARY KEY (id);


--
-- Name: common_stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY common_stocks
    ADD CONSTRAINT common_stocks_pkey PRIMARY KEY (id);


--
-- Name: companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: currencies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY currencies
    ADD CONSTRAINT currencies_pkey PRIMARY KEY (id);


--
-- Name: directors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY directors
    ADD CONSTRAINT directors_pkey PRIMARY KEY (id);


--
-- Name: dividends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dividends
    ADD CONSTRAINT dividends_pkey PRIMARY KEY (id);


--
-- Name: emails_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT emails_pkey PRIMARY KEY (id);


--
-- Name: exchanges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY exchanges
    ADD CONSTRAINT exchanges_pkey PRIMARY KEY (id);


--
-- Name: historical_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY historical_prices
    ADD CONSTRAINT historical_prices_pkey PRIMARY KEY (id);


--
-- Name: income_statements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY income_statements
    ADD CONSTRAINT income_statements_pkey PRIMARY KEY (id);


--
-- Name: industries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY industries
    ADD CONSTRAINT industries_pkey PRIMARY KEY (id);


--
-- Name: managers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY managers
    ADD CONSTRAINT managers_pkey PRIMARY KEY (id);


--
-- Name: notification_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notification_subscriptions
    ADD CONSTRAINT notification_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: people_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY people
    ADD CONSTRAINT people_pkey PRIMARY KEY (id);


--
-- Name: phone_numbers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phone_numbers
    ADD CONSTRAINT phone_numbers_pkey PRIMARY KEY (id);


--
-- Name: report_terms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY report_terms
    ADD CONSTRAINT report_terms_pkey PRIMARY KEY (id);


--
-- Name: reports_pkey; Type: CONSTRAINT; Schema: public; Owner: izelnakri
--

ALTER TABLE ONLY reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: securities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY securities
    ADD CONSTRAINT securities_pkey PRIMARY KEY (id);


--
-- Name: shareholders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY shareholders
    ADD CONSTRAINT shareholders_pkey PRIMARY KEY (id);


--
-- Name: stock_splits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock_splits
    ADD CONSTRAINT stock_splits_pkey PRIMARY KEY (id);


--
-- Name: transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: versions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY versions
    ADD CONSTRAINT versions_pkey PRIMARY KEY (id);


--
-- Name: balance_sheets_report_term_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX balance_sheets_report_term_id_index ON balance_sheets USING btree (report_term_id);


--
-- Name: cash_flow_statements_report_term_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX cash_flow_statements_report_term_id_index ON cash_flow_statements USING btree (report_term_id);


--
-- Name: common_stocks_security_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX common_stocks_security_id_index ON common_stocks USING btree (security_id);


--
-- Name: companies_industry_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX companies_industry_id_index ON companies USING btree (industry_id);


--
-- Name: companies_local_name_trgm_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX companies_local_name_trgm_index ON companies USING gin (local_name gin_trgm_ops);


--
-- Name: companies_name_trgm_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX companies_name_trgm_index ON companies USING gin (name gin_trgm_ops);


--
-- Name: companies_sourced_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX companies_sourced_name_index ON companies USING btree (sourced_name);


--
-- Name: companies_sourced_name_trgm_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX companies_sourced_name_trgm_index ON companies USING gin (sourced_name gin_trgm_ops);


--
-- Name: currencies_code_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX currencies_code_index ON currencies USING btree (code);


--
-- Name: currencies_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX currencies_name_index ON currencies USING btree (name);


--
-- Name: directors_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX directors_company_id_index ON directors USING btree (company_id);


--
-- Name: directors_person_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX directors_person_id_index ON directors USING btree (person_id);


--
-- Name: dividends_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX dividends_company_id_index ON dividends USING btree (company_id);


--
-- Name: dividends_ex_dividend_date_frequency_security_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX dividends_ex_dividend_date_frequency_security_id_index ON dividends USING btree (ex_dividend_date, frequency, security_id);


--
-- Name: dividends_security_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX dividends_security_id_index ON dividends USING btree (security_id);


--
-- Name: emails_address_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX emails_address_index ON emails USING btree (address);


--
-- Name: emails_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX emails_user_id_index ON emails USING btree (user_id);


--
-- Name: exchanges_currency_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX exchanges_currency_id_index ON exchanges USING btree (currency_id);


--
-- Name: exchanges_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX exchanges_name_index ON exchanges USING btree (name);


--
-- Name: exchanges_short_hand_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX exchanges_short_hand_index ON exchanges USING btree (short_hand);


--
-- Name: historical_prices_security_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX historical_prices_security_id_index ON historical_prices USING btree (security_id);


--
-- Name: income_statements_report_term_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX income_statements_report_term_id_index ON income_statements USING btree (report_term_id);


--
-- Name: industries_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX industries_name_index ON industries USING btree (name);


--
-- Name: managers_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX managers_company_id_index ON managers USING btree (company_id);


--
-- Name: managers_person_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX managers_person_id_index ON managers USING btree (person_id);


--
-- Name: notification_subscriptions_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notification_subscriptions_company_id_index ON notification_subscriptions USING btree (company_id);


--
-- Name: notification_subscriptions_email_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notification_subscriptions_email_id_index ON notification_subscriptions USING btree (email_id);


--
-- Name: notification_subscriptions_phone_number_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notification_subscriptions_phone_number_id_index ON notification_subscriptions USING btree (phone_number_id);


--
-- Name: notification_subscriptions_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notification_subscriptions_user_id_index ON notification_subscriptions USING btree (user_id);


--
-- Name: notifications_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_company_id_index ON notifications USING btree (company_id);


--
-- Name: notifications_director_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_director_id_index ON notifications USING btree (director_id);


--
-- Name: notifications_dividend_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_dividend_id_index ON notifications USING btree (dividend_id);


--
-- Name: notifications_manager_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_manager_id_index ON notifications USING btree (manager_id);


--
-- Name: notifications_report_term_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_report_term_id_index ON notifications USING btree (report_term_id);


--
-- Name: notifications_stock_split_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_stock_split_id_index ON notifications USING btree (stock_split_id);


--
-- Name: notifications_transaction_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_transaction_id_index ON notifications USING btree (transaction_id);


--
-- Name: people_full_name_trgm_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX people_full_name_trgm_index ON people USING gin (full_name gin_trgm_ops);


--
-- Name: people_linkname_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX people_linkname_index ON people USING btree (linkname);


--
-- Name: phone_numbers_number_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX phone_numbers_number_index ON phone_numbers USING btree (number);


--
-- Name: phone_numbers_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX phone_numbers_user_id_index ON phone_numbers USING btree (user_id);


--
-- Name: report_terms_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX report_terms_company_id_index ON report_terms USING btree (company_id);


--
-- Name: report_terms_term_year_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX report_terms_term_year_company_id_index ON report_terms USING btree (term, year, company_id);


--
-- Name: reports_company_id_index; Type: INDEX; Schema: public; Owner: izelnakri
--

CREATE INDEX reports_company_id_index ON reports USING btree (company_id);


--
-- Name: securities_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX securities_company_id_index ON securities USING btree (company_id);


--
-- Name: securities_exchange_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX securities_exchange_id_index ON securities USING btree (exchange_id);


--
-- Name: securities_isin_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX securities_isin_index ON securities USING btree (isin);


--
-- Name: securities_ticker_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX securities_ticker_index ON securities USING btree (ticker);


--
-- Name: securities_ticker_trgm_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX securities_ticker_trgm_index ON securities USING gin (ticker gin_trgm_ops);


--
-- Name: shareholders_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX shareholders_company_id_index ON shareholders USING btree (company_id);


--
-- Name: shareholders_shareholder_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX shareholders_shareholder_company_id_index ON shareholders USING btree (shareholder_company_id);


--
-- Name: shareholders_shareholder_person_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX shareholders_shareholder_person_id_index ON shareholders USING btree (shareholder_person_id);


--
-- Name: stock_splits_security_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX stock_splits_security_id_index ON stock_splits USING btree (security_id);


--
-- Name: transactions_buyer_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_buyer_company_id_index ON transactions USING btree (buyer_company_id);


--
-- Name: transactions_buyer_person_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_buyer_person_id_index ON transactions USING btree (buyer_person_id);


--
-- Name: transactions_security_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_security_id_index ON transactions USING btree (security_id);


--
-- Name: transactions_seller_company_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_seller_company_id_index ON transactions USING btree (seller_company_id);


--
-- Name: transactions_seller_person_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transactions_seller_person_id_index ON transactions USING btree (seller_person_id);


--
-- Name: users_username_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_username_index ON users USING btree (username);


--
-- Name: balance_sheets_report_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY balance_sheets
    ADD CONSTRAINT balance_sheets_report_term_id_fkey FOREIGN KEY (report_term_id) REFERENCES report_terms(id);


--
-- Name: cash_flow_statements_report_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY cash_flow_statements
    ADD CONSTRAINT cash_flow_statements_report_term_id_fkey FOREIGN KEY (report_term_id) REFERENCES report_terms(id);


--
-- Name: common_stocks_security_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY common_stocks
    ADD CONSTRAINT common_stocks_security_id_fkey FOREIGN KEY (security_id) REFERENCES securities(id);


--
-- Name: companies_industry_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY companies
    ADD CONSTRAINT companies_industry_id_fkey FOREIGN KEY (industry_id) REFERENCES industries(id);


--
-- Name: directors_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY directors
    ADD CONSTRAINT directors_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- Name: directors_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY directors
    ADD CONSTRAINT directors_person_id_fkey FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: dividends_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dividends
    ADD CONSTRAINT dividends_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- Name: dividends_security_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY dividends
    ADD CONSTRAINT dividends_security_id_fkey FOREIGN KEY (security_id) REFERENCES securities(id);


--
-- Name: emails_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY emails
    ADD CONSTRAINT emails_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: exchanges_currency_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY exchanges
    ADD CONSTRAINT exchanges_currency_id_fkey FOREIGN KEY (currency_id) REFERENCES currencies(id);


--
-- Name: historical_prices_security_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY historical_prices
    ADD CONSTRAINT historical_prices_security_id_fkey FOREIGN KEY (security_id) REFERENCES securities(id);


--
-- Name: income_statements_report_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY income_statements
    ADD CONSTRAINT income_statements_report_term_id_fkey FOREIGN KEY (report_term_id) REFERENCES report_terms(id);


--
-- Name: managers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY managers
    ADD CONSTRAINT managers_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- Name: managers_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY managers
    ADD CONSTRAINT managers_person_id_fkey FOREIGN KEY (person_id) REFERENCES people(id);


--
-- Name: notification_subscriptions_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notification_subscriptions
    ADD CONSTRAINT notification_subscriptions_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- Name: notification_subscriptions_email_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notification_subscriptions
    ADD CONSTRAINT notification_subscriptions_email_id_fkey FOREIGN KEY (email_id) REFERENCES emails(id);


--
-- Name: notification_subscriptions_phone_number_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notification_subscriptions
    ADD CONSTRAINT notification_subscriptions_phone_number_id_fkey FOREIGN KEY (phone_number_id) REFERENCES phone_numbers(id);


--
-- Name: notification_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notification_subscriptions
    ADD CONSTRAINT notification_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: notifications_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- Name: notifications_director_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_director_id_fkey FOREIGN KEY (director_id) REFERENCES directors(id);


--
-- Name: notifications_dividend_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_dividend_id_fkey FOREIGN KEY (dividend_id) REFERENCES dividends(id);


--
-- Name: notifications_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES managers(id);


--
-- Name: notifications_report_term_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_report_term_id_fkey FOREIGN KEY (report_term_id) REFERENCES report_terms(id);


--
-- Name: notifications_stock_split_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_stock_split_id_fkey FOREIGN KEY (stock_split_id) REFERENCES stock_splits(id);


--
-- Name: notifications_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY notifications
    ADD CONSTRAINT notifications_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES transactions(id);


--
-- Name: phone_numbers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY phone_numbers
    ADD CONSTRAINT phone_numbers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: report_terms_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY report_terms
    ADD CONSTRAINT report_terms_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- Name: reports_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: izelnakri
--

ALTER TABLE ONLY reports
    ADD CONSTRAINT reports_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- Name: securities_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY securities
    ADD CONSTRAINT securities_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- Name: securities_exchange_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY securities
    ADD CONSTRAINT securities_exchange_id_fkey FOREIGN KEY (exchange_id) REFERENCES exchanges(id);


--
-- Name: shareholders_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY shareholders
    ADD CONSTRAINT shareholders_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- Name: shareholders_shareholder_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY shareholders
    ADD CONSTRAINT shareholders_shareholder_company_id_fkey FOREIGN KEY (shareholder_company_id) REFERENCES companies(id);


--
-- Name: shareholders_shareholder_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY shareholders
    ADD CONSTRAINT shareholders_shareholder_person_id_fkey FOREIGN KEY (shareholder_person_id) REFERENCES people(id);


--
-- Name: stock_splits_security_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock_splits
    ADD CONSTRAINT stock_splits_security_id_fkey FOREIGN KEY (security_id) REFERENCES securities(id);


--
-- Name: transactions_buyer_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_buyer_company_id_fkey FOREIGN KEY (buyer_company_id) REFERENCES companies(id);


--
-- Name: transactions_buyer_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_buyer_person_id_fkey FOREIGN KEY (buyer_person_id) REFERENCES people(id);


--
-- Name: transactions_security_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_security_id_fkey FOREIGN KEY (security_id) REFERENCES securities(id);


--
-- Name: transactions_seller_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_seller_company_id_fkey FOREIGN KEY (seller_company_id) REFERENCES companies(id);


--
-- Name: transactions_seller_person_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY transactions
    ADD CONSTRAINT transactions_seller_person_id_fkey FOREIGN KEY (seller_person_id) REFERENCES people(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: izelnakri
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM izelnakri;
GRANT ALL ON SCHEMA public TO izelnakri;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

