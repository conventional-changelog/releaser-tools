# Use Alpine Linux as our base image so that we minimize the overall size our final container, and minimize the surface area of packages that could be out of date.
FROM node:8-alpine

# Container metadata describing the image, where it's configuration is housed, and its maintainer.
LABEL description="Docker image for executing `conventional-tidelift-releaser`."
LABEL homepage="https://github.com/conventional-changelog/releaser-tools"
LABEL maintainer="Hutson Betts <hutson@hyper-expanse.net>"
LABEL repository="https://github.com/conventional-changelog/releaser-tools.git"

# The Alpine base image does not have a standard collection of CA root certificates installed. As a result all HTTPS requests will fail with 'x509: failed to load system roots and no root provided'.
# We install the `ca-certificates` package to have access to a standard collection of CA root certificates for HTTPS operations that the `conventional-tidelift-releaser` tool executes to interact with an npm-compatible registry.
# We install the `git` package for Git operations that the `conventional-tidelift-releaser` tool executes.
RUN apk update && \
  apk add --no-cache --progress ca-certificates && \
  apk add --no-cache --progress git

# Copy only those files required in production.
COPY package.json /tmp/conventional-tidelift-releaser/package.json
COPY src/ /tmp/conventional-tidelift-releaser/src/

# Setup a dedicated directory to house the code, from which releases will be generated, that's stilled owned by the `node` user.
RUN mkdir /app; \
  chown node:node /app; \
  chown node:node -R /tmp/conventional-tidelift-releaser;

# Switch to the `node` user for all subsequent commands. Configuring the `USER` also causes all commands executed by `docker run` to run as the `node` user by default.
# Docker's _Security_ guide has a [Conclusions](https://docs.docker.com/engine/security/security/#conclusions) section that recommends, for added security, using a non-root user to run commands.
# Some background on Docker security best practices - https://groups.google.com/forum/#!msg/docker-user/e9RkC4y-21E/JOZF8H-PfYsJ
USER node:node

# Install only production dependencies for the `conventional-tidelift-releaser` package.
# We create a symbolic link in the global binary directory that points to the `conventional-tidelift-releaser` executable.
RUN yarn global add file:/tmp/conventional-tidelift-releaser/

# Set the working directory for future commands that need to operate on the file system, or as the starting directory when a user logs into a container based on this image.
WORKDIR /app

# Instruct Docker that the following directory may contain externally mounted volumes from the host system, or other containers.
# Any files already existing within the following directory are copied into the mounted volume.
# Mounting the current directory from the host system, for the purpose of development, is usually done by running the following:
# > docker run --volume "$(pwd)":/app <IMAGE NAME>
VOLUME /app

# Command to execute within the Docker container when executed by `docker run`, unless overriden by `--entrypoint`.
# This command causes the container to automatically run the Conventional Changelog releaser tool for Tidelift, `conventional-tidelift-releaser`, within the working directory.
# We assume the contents of a project, including it's `.git` directory, has been mounted inside of the container at the `WORKDIR` specified above.
# By using the Exec form of `ENTRYPOINT`, additional arguments may be passed through `docker run` to the `conventional-tidelift-releaser` tool.
ENTRYPOINT ["/home/node/.yarn/bin/conventional-tidelift-releaser"]
