#[cfg(test)]
mod tests {
    use app::utils::dates;

    #[test]
    fn format_durations() {
        assert_eq!(dates::format_duration(0), "0h0m");
        assert_eq!(dates::format_duration(60), "0h1m");
        assert_eq!(dates::format_duration(1800), "0h30m");
        assert_eq!(dates::format_duration(3599), "0h59m");
        assert_eq!(dates::format_duration(3600), "1h0m");
        assert_eq!(dates::format_duration(3661), "1h1m");
        assert_eq!(dates::format_duration(5400), "1h30m");
    }
}
