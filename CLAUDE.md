# Project conventions

## Claude Code integration

This repo ships Codespaces + Claude Code integration. `.devcontainer/devcontainer.json` installs the Claude Code CLI globally on container create so `claude` is available in every new terminal.

## Skill usage policy

**Always ask the user before invoking any skill.** A `PreToolUse` hook in `.claude/settings.json` (matcher `Skill`) already forces a permission prompt before every skill call — do not bypass it. If the user has not explicitly approved a specific skill for the task at hand, stop and ask first.

## Superpowers plugin

The `superpowers@claude-plugins-official` plugin is pre-enabled via `enabledPlugins` in `.claude/settings.json`. On a fresh Codespace or new machine, if `/plugin list` does not show it, install once with:

```
/plugin install superpowers@claude-plugins-official
```

A `SessionStart` hook surfaces this reminder automatically.
