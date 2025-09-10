"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  alpha,
  useTheme,
  ClickAwayListener,
} from "@mui/material"
import { Search, Clear } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { getSearchSuggestions } from "@/lib/actions/search-actions"
import { useDebouncedCallback } from "use-debounce"

interface SearchBarProps {
  initialQuery?: string
  placeholder?: string
  onSearch?: (query: string) => void
  fullWidth?: boolean
}

export default function SearchBar({
  initialQuery = "",
  placeholder = "Search gear...",
  onSearch,
  fullWidth = false,
}: SearchBarProps) {
  const router = useRouter()
  const theme = useTheme()
  const [query, setQuery] = useState(initialQuery)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const debouncedGetSuggestions = useDebouncedCallback(async (searchQuery: string) => {
    if (searchQuery.length >= 2) {
      setLoading(true)
      try {
        const results = await getSearchSuggestions(searchQuery)
        setSuggestions(results)
        setShowSuggestions(true)
      } catch (error) {
        console.error("Error getting suggestions:", error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, 300)

  useEffect(() => {
    debouncedGetSuggestions(query)
  }, [query, debouncedGetSuggestions])

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      setShowSuggestions(false)
      if (onSearch) {
        onSearch(searchQuery.trim())
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    setQuery("")
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  return (
    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
      <Box sx={{ position: "relative", width: fullWidth ? "100%" : "auto" }}>
        <Box
          sx={{
            position: "relative",
            borderRadius: 1,
            backgroundColor: alpha("#ffffff", 0.1),
            "&:hover": {
              backgroundColor: alpha("#ffffff", 0.15),
            },
            "&:focus-within": {
              backgroundColor: alpha("#ffffff", 0.15),
              boxShadow: `0 0 0 2px ${alpha("#FF6B35", 0.3)}`,
            },
            width: fullWidth ? "100%" : { xs: "100%", sm: "auto" },
            maxWidth: fullWidth ? "none" : { xs: 200, sm: 300 },
            transition: "all 0.3s ease",
          }}
        >
          <Box
            sx={{
              padding: theme.spacing(0, 2),
              height: "100%",
              position: "absolute",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <Search sx={{ color: "#999" }} />
          </Box>
          <InputBase
            ref={inputRef}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            sx={{
              color: "inherit",
              width: "100%",
              "& .MuiInputBase-input": {
                padding: theme.spacing(1, 1, 1, 0),
                paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                paddingRight: query ? `calc(1em + ${theme.spacing(4)})` : theme.spacing(1),
                transition: theme.transitions.create("width"),
                width: "100%",
                fontSize: "0.9rem",
              },
            }}
          />
          {query && (
            <IconButton
              size="small"
              onClick={handleClear}
              sx={{
                position: "absolute",
                right: 4,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#999",
                "&:hover": {
                  color: "#FF6B35",
                },
              }}
            >
              <Clear fontSize="small" />
            </IconButton>
          )}
        </Box>

        {/* Suggestions Dropdown */}
        {showSuggestions && (suggestions.length > 0 || loading) && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
              mt: 1,
              bgcolor: "#111111",
              border: "1px solid #333",
              borderRadius: 1,
              maxHeight: 300,
              overflow: "auto",
            }}
          >
            {loading ? (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#999" }}>
                  Searching...
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    component="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      py: 1,
                      px: 2,
                      "&:hover": {
                        bgcolor: "rgba(255, 107, 53, 0.1)",
                      },
                    }}
                  >
                    <Search sx={{ color: "#666", mr: 2, fontSize: 18 }} />
                    <ListItemText
                      primary={suggestion}
                      primaryTypographyProps={{
                        variant: "body2",
                        sx: { color: "white" },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  )
}
