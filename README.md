# Auto Label by File Path 🗂️

[![GitHub release](https://img.shields.io/github/v/release/rkneela0912/auto-label-by-path)](https://github.com/rkneela0912/auto-label-by-path/releases) [![MIT License](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

Automatically label pull requests based on which files or directories were modified. Perfect for organizing PRs by component, team, or area of responsibility.

## Why Use Auto Label by Path?

- **🎯 Automatic Organization:** PRs are labeled instantly based on files changed
- **👥 Team Routing:** Route PRs to the right team automatically
- **📊 Better Insights:** Track changes by component or area
- **⚡ Zero Manual Work:** No more manually adding labels
- **🔧 Flexible Patterns:** Supports wildcards and complex path matching

## Features

- Automatic labeling based on file paths
- Wildcard pattern matching (`*`, `**`)
- Multiple labels per PR
- Customizable path-to-label mappings
- Works with any repository structure
- Auto-creates labels if they don't exist

## Quick Start

Create `.github/workflows/auto-label.yml`:

```yaml
name: Auto Label by Path

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  label:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      issues: write
    
    steps:
      - name: Label PR by paths
        uses: rkneela0912/auto-label-by-path@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          path_labels: |
            {
              "src/frontend/**": "frontend",
              "src/backend/**": "backend",
              "docs/**": "documentation",
              "*.md": "documentation",
              "tests/**": "testing"
            }
```

## Configuration

### Path Patterns

The action supports glob-style patterns:

| Pattern | Matches |
|---------|---------|
| `src/frontend/**` | All files under `src/frontend/` |
| `*.md` | All Markdown files in root |
| `docs/**/*.md` | All Markdown files under `docs/` |
| `api/*.js` | JavaScript files directly in `api/` |
| `**/*.test.js` | All test files anywhere |

### Example Configurations

#### By Component

```yaml
path_labels: |
  {
    "src/auth/**": "auth",
    "src/api/**": "api",
    "src/ui/**": "ui",
    "src/database/**": "database"
  }
```

#### By Team

```yaml
path_labels: |
  {
    "frontend/**": "team-frontend",
    "backend/**": "team-backend",
    "infrastructure/**": "team-devops",
    "docs/**": "team-docs"
  }
```

#### By File Type

```yaml
path_labels: |
  {
    "**/*.js": "javascript",
    "**/*.py": "python",
    "**/*.md": "documentation",
    "**/*.yml": "config",
    "**/*.test.*": "tests"
  }
```

#### Mixed Strategy

```yaml
path_labels: |
  {
    "src/frontend/**": "frontend",
    "src/backend/**": "backend",
    "**/*.test.*": "testing",
    "docs/**": "documentation",
    ".github/**": "ci-cd",
    "package.json": "dependencies",
    "*.md": "documentation"
  }
```

## Inputs

| Input | Description | Required |
|-------|-------------|----------|
| `github_token` | GitHub token for API access | ✅ Yes |
| `path_labels` | JSON mapping of path patterns to labels | ✅ Yes |

## Outputs

| Output | Description |
|--------|-------------|
| `labels_added` | Comma-separated list of labels that were added |

## Examples

### Basic Usage

```yaml
name: Auto Label
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  label:
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write
      issues: write
    steps:
      - uses: rkneela0912/auto-label-by-path@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          path_labels: |
            {
              "src/**": "source-code",
              "tests/**": "testing",
              "docs/**": "documentation"
            }
```

### With Output Usage

```yaml
- name: Label by path
  id: labeler
  uses: rkneela0912/auto-label-by-path@v1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    path_labels: |
      {
        "src/critical/**": "critical",
        "src/experimental/**": "experimental"
      }

- name: Notify on critical changes
  if: contains(steps.labeler.outputs.labels_added, 'critical')
  run: echo "Critical code was modified!"
```

### Monorepo Configuration

```yaml
path_labels: |
  {
    "packages/app-web/**": "app-web",
    "packages/app-mobile/**": "app-mobile",
    "packages/shared/**": "shared",
    "packages/api/**": "api",
    "infrastructure/**": "infrastructure"
  }
```

## Pattern Matching Rules

### Wildcards

- `*` - Matches any characters except `/`
- `**` - Matches any characters including `/`
- `?` - Matches exactly one character

### Examples

```
src/**/*.js        → src/components/Button.js ✅
                   → src/utils/helpers.js ✅
                   → src/index.js ✅

src/*.js           → src/index.js ✅
                   → src/components/Button.js ❌

**/*.test.js       → anywhere/file.test.js ✅
                   → tests/unit/api.test.js ✅

docs/**            → docs/README.md ✅
                   → docs/api/endpoints.md ✅
```

## How It Works

1. Triggered when a PR is opened or updated
2. Fetches all changed files in the PR
3. Matches each file against the path patterns
4. Collects all matching labels
5. Adds labels to the PR
6. Creates labels if they don't exist

## Best Practices

### ✅ Do:
- Use specific patterns for better organization
- Combine multiple strategies (component + file type)
- Keep label names consistent and lowercase
- Document your labeling strategy in CONTRIBUTING.md
- Use descriptive label names

### ❌ Don't:
- Create too many labels (keep it manageable)
- Use overlapping patterns that cause confusion
- Forget to update patterns when restructuring code
- Use special characters in label names

## Permissions

This action requires:

```yaml
permissions:
  pull-requests: write  # To add labels
  issues: write         # PRs are issues in GitHub's API
```

## Common Use Cases

### 1. Component-Based Labeling
Automatically label PRs by which component they touch

### 2. Team Assignment
Route PRs to teams based on code ownership

### 3. Review Requirements
Trigger different review requirements based on labels

### 4. Release Notes
Group changes by component in release notes

### 5. Metrics & Analytics
Track which areas of the codebase change most frequently

## Troubleshooting

**Labels not being added?**
- Check that patterns match your file paths exactly
- Verify JSON syntax in `path_labels`
- Ensure permissions are correct

**Too many labels?**
- Make patterns more specific
- Review for overlapping patterns

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## License

[MIT License](LICENSE)

## Support

⭐ Star this repo if you find it helpful!

For issues or questions, [open an issue](https://github.com/rkneela0912/auto-label-by-path/issues).


## 🎯 Use Cases

- **Monorepos:** Label by service/package
- **Team Routing:** Auto-assign based on labels
- **Release Notes:** Group changes by area
- **Metrics:** Track changes by component

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
