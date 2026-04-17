# Project conventions

## Claude Code integration

This repo ships Codespaces + Claude Code integration. `.devcontainer/devcontainer.json` installs the Claude Code CLI globally on container create so `claude` is available in every new terminal.

## Skill usage policy

**Always ask the user before invoking any skill.** A `PreToolUse` hook in `.claude/settings.json` (matcher `Skill`) already forces a permission prompt before every skill call — do not bypass it. If the user has not explicitly approved a specific skill for the task at hand, stop and ask first.

## Enabled plugins

Both plugins are pre-enabled via `enabledPlugins` in `.claude/settings.json` so new Codespaces and new terminals integrate automatically. On a fresh environment (first time only), if `/plugin list` does not show them, install:

```
/plugin install superpowers@claude-plugins-official
/plugin marketplace add zarazhangrui/frontend-slides
/plugin install frontend-slides@frontend-slides
```

`frontend-slides` is registered via `extraKnownMarketplaces`. A `SessionStart` hook surfaces the install reminder automatically. Skill-use confirmation policy above applies to all of these.
